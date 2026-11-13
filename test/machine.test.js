import assert from 'node:assert/strict'
import test from 'node:test'
import { createPetMachine } from '../src/pet/machine.js'

const at = 1_000_000

function signal(kind, extra = {}) {
  return {
    sessionId: 'session-a',
    kind,
    at,
    source: 'verified-host-event',
    ...extra,
  }
}

test('starts idle and ignores signals that are not verified host events', () => {
  const machine = createPetMachine()
  assert.equal(machine.state, 'idle')
  machine.apply({ ...signal('tool_started'), source: 'dom-text' })
  assert.equal(machine.state, 'idle')
})

test('tool execution shows working and model execution shows thinking', () => {
  const machine = createPetMachine()
  machine.apply(signal('tool_started'))
  assert.equal(machine.state, 'working')
  machine.apply(signal('model_started'))
  assert.equal(machine.state, 'thinking')
})

test('waiting_permission outranks an active run until it resolves', () => {
  const machine = createPetMachine()
  machine.apply(signal('tool_started'))
  machine.apply(signal('permission_requested'))
  assert.equal(machine.state, 'waiting_permission')
  machine.apply(signal('permission_resolved'))
  assert.equal(machine.state, 'working')
})

test('success and failure flash, then return to idle', () => {
  const machine = createPetMachine()
  machine.apply(signal('run_completed', { runId: 'run-1' }))
  assert.equal(machine.state, 'success')
  machine.apply(signal('tick', { at: at + 1_999 }))
  assert.equal(machine.state, 'success')
  machine.apply(signal('tick', { at: at + 2_000 }))
  assert.equal(machine.state, 'idle')

  machine.apply(signal('run_failed', { runId: 'run-2' }))
  assert.equal(machine.state, 'failure')
  machine.apply(signal('tick', { at: at + 2_000 }))
  assert.equal(machine.state, 'idle')
})

test('cancel does not show success, and a new run interrupts a flash', () => {
  const machine = createPetMachine()
  machine.apply(signal('run_cancelled', { runId: 'run-1' }))
  assert.equal(machine.state, 'idle')
  machine.apply(signal('run_completed', { runId: 'run-2' }))
  machine.apply(signal('model_started', { at: at + 100 }))
  assert.equal(machine.state, 'thinking')
})

test('session change clears transient state and sleep waits out an active run', () => {
  const machine = createPetMachine()
  machine.apply(signal('tool_started'))
  machine.apply(signal('session_changed', { sessionId: 'session-b' }))
  assert.equal(machine.state, 'idle')

  machine.apply(signal('tool_started', { sessionId: 'session-b' }))
  machine.apply(signal('tick', { sessionId: 'session-b', at: at + 6 * 60_000 }))
  assert.equal(machine.state, 'working')

  machine.apply(signal('run_cancelled', { sessionId: 'session-b', runId: 'run-3' }))
  machine.apply(signal('tick', { sessionId: 'session-b', at: at + 6 * 60_000 }))
  assert.equal(machine.state, 'sleep')
})

test('sleep does not start while a permission is waiting', () => {
  const machine = createPetMachine()
  machine.apply(signal('permission_requested'))
  machine.apply(signal('tick', { at: at + 6 * 60_000 }))
  assert.equal(machine.state, 'waiting_permission')
})
