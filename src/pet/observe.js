const SOURCE = 'verified-host-event'

/**
 * Cursor for one observed session. The first event window is a baseline:
 * a turn that already ended before we looked does not flash.
 * @returns {ObservationCursor}
 */
export function createObservationCursor() {
  return {
    sessionId: null,
    seenWindow: false,
    consumedTurnEnd: -1,
    running: false,
    permission: false,
    activity: null,
  }
}

/**
 * @param {string|null} sessionId
 * @param {string} kind
 * @param {number} at
 */
function signal(sessionId, kind, at) {
  return {
    source: SOURCE,
    sessionId,
    kind,
    at,
  }
}

/**
 * @param {object|null|undefined} entry
 */
function eventRecord(entry) {
  const event = entry && entry.event
  if (!event || typeof event.type !== 'string') return null
  return event
}

/**
 * @param {readonly object[]} entries
 */
function latestTurnEnd(entries) {
  /** @type {object|null} */
  let found = null
  for (let index = 0; index < entries.length; index += 1) {
    const event = eventRecord(entries[index])
    if (event === null || event.type !== 'turn/end' || typeof event.seq !== 'number') continue
    if (found === null || event.seq >= found.seq) found = event
  }
  return found
}

/**
 * @param {object|null} event
 * @returns {'run_completed'|'run_failed'|'run_cancelled'}
 */
function terminalKind(event) {
  const kind = event && event.data && event.data.reason && event.data.reason.kind
  if (kind === 'completed') return 'run_completed'
  if (kind === 'error') return 'run_failed'
  return 'run_cancelled'
}

/**
 * @param {object} event
 * @returns {string|null}
 */
function toolCallId(event) {
  if (event.type === 'tool/call') {
    const id = event.data && event.data.callId
    return typeof id === 'string' && id !== '' ? id : null
  }
  if (event.type === 'tool/result') {
    const message = event.data && event.data.message
    const id = message && (message.toolCallId || message.callId)
    return typeof id === 'string' && id !== '' ? id : null
  }
  return null
}

/**
 * Whether the newest turn still has a tool call without its result.
 * A window that starts after `turn/start` stays open until `turn/end`.
 * @param {readonly object[]|null|undefined} entries
 * @returns {boolean}
 */
export function hasOpenToolCall(entries) {
  if (!Array.isArray(entries)) return false
  let sawStart = false
  let open = false
  const calls = new Set()
  for (let index = 0; index < entries.length; index += 1) {
    const event = eventRecord(entries[index])
    if (event === null) continue
    if (event.type === 'turn/start') {
      sawStart = true
      open = true
      calls.clear()
      continue
    }
    if (event.type === 'turn/end') {
      open = false
      calls.clear()
      continue
    }
    if (!sawStart && !open) open = true
    if (!open) continue
    if (event.type === 'tool/call') {
      const id = toolCallId(event)
      if (id !== null) calls.add(id)
    } else if (event.type === 'tool/result') {
      const id = toolCallId(event)
      if (id !== null) calls.delete(id)
    }
  }
  return calls.size > 0
}

/**
 * Turn one verified host observation into pet-machine signals.
 * History loads (`replace` / `prepend`, and the first window) do not flash.
 * A later `turn/end` does: completed, error, or anything else as cancel.
 * Tool calls with no matching result are working; a running turn without one is thinking.
 * Running alone, with no event window, stays idle.
 * @param {ObservationCursor} cursor
 * @param {HostObservation} observation
 * @returns {{cursor: ObservationCursor, signals: object[]}}
 */
export function observeHost(cursor, observation) {
  const next = {
    sessionId: cursor.sessionId,
    seenWindow: cursor.seenWindow,
    consumedTurnEnd: cursor.consumedTurnEnd,
    running: cursor.running,
    permission: cursor.permission,
    activity: cursor.activity,
  }
  /** @type {object[]} */
  const signals = []
  const at = typeof observation.at === 'number' ? observation.at : 0
  const sessionId = typeof observation.sessionId === 'string' ? observation.sessionId : null
  const running = observation.running === true
  const pending = observation.pending === true
  const entries = Array.isArray(observation.entries) ? observation.entries : null
  const changeKind = observation.changeKind

  if (sessionId !== next.sessionId) {
    signals.push(signal(sessionId, 'session_changed', at))
    next.sessionId = sessionId
    next.seenWindow = false
    next.consumedTurnEnd = -1
    next.running = false
    next.permission = false
    next.activity = null
  }

  let emittedTerminal = false
  if (entries !== null) {
    const end = latestTurnEnd(entries)
    const latest = end === null ? -1 : end.seq
    if (!next.seenWindow) {
      next.seenWindow = true
      next.consumedTurnEnd = latest
    } else if (changeKind === 'replace' || changeKind === 'prepend') {
      if (latest > next.consumedTurnEnd && next.running && end !== null) {
        signals.push(signal(sessionId, terminalKind(end), at))
        emittedTerminal = true
      }
      next.consumedTurnEnd = Math.max(next.consumedTurnEnd, latest)
    } else if (latest > next.consumedTurnEnd && end !== null) {
      signals.push(signal(sessionId, terminalKind(end), at))
      emittedTerminal = true
      next.consumedTurnEnd = latest
    }
  }

  if (next.running && !running && !emittedTerminal) {
    signals.push(signal(sessionId, 'run_cancelled', at))
  }
  next.running = running

  if (emittedTerminal) {
    next.activity = null
  } else if (running && entries !== null) {
    const desired = hasOpenToolCall(entries) ? 'working' : 'thinking'
    if (desired !== next.activity) {
      signals.push(signal(sessionId, desired === 'working' ? 'tool_started' : 'model_started', at))
      next.activity = desired
    }
  } else if (!running) {
    next.activity = null
  }

  if (pending && !next.permission) {
    signals.push(signal(sessionId, 'permission_requested', at))
    next.permission = true
  } else if (!pending && next.permission) {
    signals.push(signal(sessionId, 'permission_resolved', at))
    next.permission = false
  }

  return { cursor: next, signals }
}
