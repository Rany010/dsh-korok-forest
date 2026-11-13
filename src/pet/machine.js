/** @typedef {'idle'|'thinking'|'working'|'waiting_permission'|'success'|'failure'|'sleep'} PetState */

const FLASH_MS = 2000
const SLEEP_MS = 5 * 60 * 1000
const VERIFIED = 'verified-host-event'

/**
 * Pet state machine. Visible state follows verified host signals only.
 * @returns {{state: PetState, apply: (signal: object) => PetState}}
 */
export function createPetMachine() {
  /** @type {string|null} */
  let sessionId = null
  let permission = false
  /** @type {'thinking'|'working'|null} */
  let activity = null
  /** @type {{kind: 'success'|'failure', until: number}|null} */
  let flash = null
  /** @type {number|null} */
  let quietAt = null
  let now = 0

  function visible() {
    if (permission) return 'waiting_permission'
    if (flash !== null && now < flash.until) return flash.kind
    if (activity !== null) return activity
    if (quietAt !== null && now - quietAt >= SLEEP_MS) return 'sleep'
    return 'idle'
  }

  function markQuiet(at) {
    activity = null
    flash = null
    quietAt = at
  }

  return {
    get state() {
      return visible()
    },
    apply(signal) {
      if (signal?.source !== VERIFIED) return visible()
      const at = typeof signal.at === 'number' ? signal.at : now
      now = at
      if (signal.kind === 'session_changed') {
        sessionId = typeof signal.sessionId === 'string' ? signal.sessionId : null
        permission = false
        markQuiet(at)
        return visible()
      }
      if (sessionId === null && typeof signal.sessionId === 'string') sessionId = signal.sessionId
      if (typeof signal.sessionId === 'string' && signal.sessionId !== sessionId) return visible()

      if (signal.kind === 'tick') return visible()
      if (signal.kind === 'permission_requested') {
        permission = true
        return visible()
      }
      if (signal.kind === 'permission_resolved') {
        permission = false
        if (activity === null && (flash === null || now >= flash.until)) quietAt = at
        return visible()
      }
      if (signal.kind === 'tool_started') {
        activity = 'working'
        flash = null
        quietAt = null
        return visible()
      }
      if (signal.kind === 'model_started') {
        activity = 'thinking'
        flash = null
        quietAt = null
        return visible()
      }
      if (signal.kind === 'run_completed' || signal.kind === 'run_failed') {
        permission = false
        activity = null
        flash = {
          kind: signal.kind === 'run_completed' ? 'success' : 'failure',
          until: at + FLASH_MS,
        }
        quietAt = at
        return visible()
      }
      if (signal.kind === 'run_cancelled') {
        permission = false
        markQuiet(at)
        return visible()
      }
      return visible()
    },
  }
}
