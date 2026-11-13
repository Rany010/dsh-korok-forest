import assert from 'node:assert/strict'
import test from 'node:test'
import { createSeedLedger } from '../src/seeds/ledger.js'

test('a completed event with a stable id awards one seed', () => {
  const ledger = createSeedLedger()
  const first = ledger.award({
    scope: 'session-a',
    id: 'run-1',
    outcome: 'completed',
  })
  assert.equal(first.awarded, true)
  assert.equal(first.ledger.totalSeeds, 1)
  assert.equal(first.ledger.recentAwards.length, 1)
})

test('replay, cancel, failure, and tool completion do not award', () => {
  const ledger = createSeedLedger()
  const first = ledger.award({ scope: 'session-a', id: 'run-1', outcome: 'completed' })
  const replay = first.ledger.award({ scope: 'session-a', id: 'run-1', outcome: 'completed' })
  assert.equal(replay.awarded, false)
  assert.equal(replay.ledger.totalSeeds, 1)
  for (const outcome of ['cancelled', 'failed', 'tool_completed']) {
    const result = replay.ledger.award({ scope: 'session-a', id: `run-${outcome}`, outcome })
    assert.equal(result.awarded, false)
    assert.equal(result.ledger.totalSeeds, 1)
  }
})

test('missing id refuses the award instead of inventing a key', () => {
  const ledger = createSeedLedger()
  const result = ledger.award({ scope: 'session-a', outcome: 'completed' })
  assert.equal(result.awarded, false)
  assert.equal(result.reason, 'missing-id')
  assert.equal(result.ledger.totalSeeds, 0)
})

test('automatic awards stay closed until the host contract is enabled', () => {
  const ledger = createSeedLedger()
  const result = ledger.award({
    scope: 'session-a',
    id: 'run-1',
    outcome: 'completed',
    automatic: true,
  })
  assert.equal(result.awarded, false)
  assert.equal(result.reason, 'automatic-disabled')
  assert.equal(result.ledger.totalSeeds, 0)
})

test('clear removes seeds and award history', () => {
  const ledger = createSeedLedger()
  const awarded = ledger.award({ scope: 's', id: 'run-1', outcome: 'completed' })
  const cleared = awarded.ledger.clear()
  assert.equal(cleared.totalSeeds, 0)
  assert.deepEqual(cleared.awardedEventIds, [])
  assert.deepEqual(cleared.recentAwards, [])
})
