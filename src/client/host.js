/** @type {object|null} */
let sessions = null

/**
 * Keep the host sessions service for the pet frame.
 * @param {object|null|undefined} value - `ctx.sessions`, or null when the plugin stops.
 */
export function bindSessions(value) {
  sessions = value ?? null
}

/**
 * Event window of a session the host is already retaining.
 * Borrowing does not open history and does not subscribe to the approval waterfall.
 * @param {string|null|undefined} sessionId
 * @returns {object|null}
 */
export function eventSourceOf(sessionId) {
  if (sessions === null || typeof sessionId !== 'string') return null
  if (typeof sessions.binding !== 'function') return null
  const binding = sessions.binding(sessionId)
  const source = binding && binding.eventSource
  if (source == null || typeof source.getSnapshot !== 'function' || typeof source.subscribe !== 'function') {
    return null
  }
  return source
}
