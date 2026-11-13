import assert from 'node:assert/strict'
import test from 'node:test'
import { createPetMachine } from '../src/pet/machine.js'
import { createObservationCursor, hasOpenToolCall, observeHost } from '../src/pet/observe.js'

const at = 5_000

function entry(type, seq, data = {}) {
  return { type: 'event', event: { type, seq, time: seq, data } }
}

function observe(cursor, extra) {
  return observeHost(cursor, {
    sessionId: 'session-a',
    running: false,
    pending: false,
    entries: [],
    changeKind: 'replace',
    at,
    ...extra,
  })
}

function kinds(signals) {
  return signals.map(signal => signal.kind)
}

test('the first history window does not replay an old completion', () => {
  const cursor = createObservationCursor()
  const first = observe(cursor, {
    entries: [
      entry('turn/start', 1, { turn: 1 }),
      entry('turn/end', 2, { turn: 1, reason: { kind: 'completed' } }),
    ],
    changeKind: 'replace',
  })
  assert.deepEqual(kinds(first.signals), ['session_changed'])
  assert.equal(first.cursor.consumedTurnEnd, 2)

  const again = observe(first.cursor, {
    entries: [
      entry('turn/start', 1, { turn: 1 }),
      entry('turn/end', 2, { turn: 1, reason: { kind: 'completed' } }),
    ],
    changeKind: 'replace',
  })
  assert.deepEqual(kinds(again.signals), [])
})

test('a newly appended turn end flashes success, failure, or cancel', () => {
  let cursor = observe(createObservationCursor(), { entries: [], changeKind: 'replace' }).cursor
  cursor = { ...cursor, running: true, activity: 'thinking' }

  const completed = observe(cursor, {
    running: false,
    entries: [entry('turn/end', 4, { turn: 1, reason: { kind: 'completed' } })],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(completed.signals), ['run_completed'])

  const failed = observe(cursor, {
    running: false,
    entries: [entry('turn/end', 5, { turn: 1, reason: { kind: 'error' } })],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(failed.signals), ['run_failed'])

  const aborted = observe(cursor, {
    running: false,
    entries: [entry('turn/end', 6, { turn: 1, reason: { kind: 'aborted' } })],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(aborted.signals), ['run_cancelled'])
})

test('running without a new turn end is cancel, not success', () => {
  const primed = observe(createObservationCursor(), {
    running: true,
    entries: [entry('turn/start', 1, { turn: 1 })],
    changeKind: 'replace',
  })
  const stopped = observe(primed.cursor, {
    running: false,
    entries: [entry('turn/start', 1, { turn: 1 })],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(stopped.signals), ['run_cancelled'])
})

test('an open tool call is working and a running turn without one is thinking', () => {
  const primed = observe(createObservationCursor(), { entries: [], changeKind: 'replace' })
  const thinking = observe(primed.cursor, {
    running: true,
    entries: [
      entry('turn/start', 1, { turn: 1 }),
      entry('step/start', 2, { turn: 1, step: 1 }),
    ],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(thinking.signals), ['model_started'])

  const working = observe(thinking.cursor, {
    running: true,
    entries: [
      entry('turn/start', 1, { turn: 1 }),
      entry('tool/call', 3, { callId: 'call-1' }),
    ],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(working.signals), ['tool_started'])

  const back = observe(working.cursor, {
    running: true,
    entries: [
      entry('turn/start', 1, { turn: 1 }),
      entry('tool/call', 3, { callId: 'call-1' }),
      entry('tool/result', 4, { message: { toolCallId: 'call-1' } }),
    ],
    changeKind: 'append',
  })
  assert.deepEqual(kinds(back.signals), ['model_started'])
  assert.equal(hasOpenToolCall([
    entry('tool/call', 3, { callId: 'call-1' }),
    entry('tool/result', 4, { message: { toolCallId: 'call-1' } }),
  ]), false)
})

test('running with no event window does not guess thinking', () => {
  const primed = observe(createObservationCursor(), { entries: null, changeKind: null })
  const running = observe(primed.cursor, {
    running: true,
    entries: null,
    changeKind: null,
  })
  assert.deepEqual(kinds(running.signals), [])
  assert.equal(running.cursor.activity, null)
})

test('permission is read from status and a session switch drops the previous pose', () => {
  const primed = observe(createObservationCursor(), {
    running: true,
    entries: [entry('turn/start', 1, { turn: 1 }), entry('tool/call', 2, { callId: 'call-1' })],
    changeKind: 'replace',
  })
  const waiting = observe(primed.cursor, { running: true, pending: true, changeKind: null, entries: null })
  assert.ok(kinds(waiting.signals).includes('permission_requested'))

  const switched = observe(waiting.cursor, {
    sessionId: 'session-b',
    entries: [entry('turn/end', 9, { turn: 3, reason: { kind: 'completed' } })],
    changeKind: 'replace',
  })
  assert.deepEqual(kinds(switched.signals), ['session_changed'])
  assert.equal(switched.cursor.sessionId, 'session-b')
  assert.equal(switched.cursor.permission, false)
})

test('observed signals drive the pet machine', () => {
  const machine = createPetMachine()
  let cursor = createObservationCursor()
  const steps = [
    { running: true, entries: [entry('turn/start', 1)], changeKind: 'replace' },
    {
      running: true,
      entries: [entry('turn/start', 1), entry('tool/call', 2, { callId: 'call-1' })],
      changeKind: 'append',
    },
    { running: true, pending: true, entries: [entry('turn/start', 1), entry('tool/call', 2, { callId: 'call-1' })], changeKind: 'append' },
    {
      running: false,
      pending: false,
      entries: [entry('turn/end', 3, { reason: { kind: 'completed' } })],
      changeKind: 'append',
    },
  ]
  /** @type {string[]} */
  const states = []
  for (const step of steps) {
    const observed = observe(cursor, step)
    cursor = observed.cursor
    let state = machine.state
    for (const item of observed.signals) state = machine.apply(item)
    states.push(state)
  }
  assert.deepEqual(states, ['thinking', 'working', 'waiting_permission', 'success'])
})
