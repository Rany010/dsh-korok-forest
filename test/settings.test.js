import assert from 'node:assert/strict'
import test from 'node:test'
import { defaultSettings, parseSettings } from '../src/settings/model.js'

test('V2 documents acquire scene defaults while retaining pet preferences', () => {
  const settings = parseSettings(JSON.stringify({ schemaVersion: 1, petVisible: false, motion: 'low' }))
  assert.equal(settings.backgroundVisible, true)
  assert.equal(settings.backgroundIntensity, 88)
  assert.equal(settings.simpleReading, false)
  assert.equal(settings.petVisible, false)
  assert.equal(settings.motion, 'low')
})

test('scene preferences round-trip, clamp percentages, and reject malformed values', () => {
  const parse = patch => parseSettings(JSON.stringify({ ...defaultSettings(), ...patch }))
  assert.equal(parse({ backgroundVisible: false }).backgroundVisible, false)
  assert.equal(parse({ simpleReading: true }).simpleReading, true)
  assert.equal(parse({ backgroundIntensity: 0 }).backgroundIntensity, 0)
  assert.equal(parse({ backgroundIntensity: 125 }).backgroundIntensity, 100)
  assert.equal(parse({ backgroundIntensity: -1 }).backgroundIntensity, 0)
  assert.equal(parse({ backgroundIntensity: 'bad' }).backgroundIntensity, 88)
})

test('defaults keep the pet visible, motion on, and automatic seeds off', () => {
  const settings = defaultSettings()
  assert.equal(settings.schemaVersion, 1)
  assert.equal(settings.petVisible, true)
  assert.equal(settings.petSize, 'M')
  assert.equal(settings.motion, 'standard')
  assert.equal(settings.seedsAutomatic, false)
  assert.equal(settings.sidebarTexture, false)
})

test('round-trips a valid document and rejects the wrong schema', () => {
  const raw = JSON.stringify({
    ...defaultSettings(),
    petSize: 'L',
    motion: 'off',
  })
  assert.equal(parseSettings(raw).petSize, 'L')
  assert.equal(parseSettings(raw).motion, 'off')
  assert.throws(() => parseSettings('{"schemaVersion":2}'), /schemaVersion/)
})

test('drops unknown pet sizes and motion levels back to defaults', () => {
  const parsed = parseSettings(JSON.stringify({
    schemaVersion: 1,
    petSize: 'XL',
    motion: 'wild',
  }))
  assert.equal(parsed.petSize, 'M')
  assert.equal(parsed.motion, 'standard')
})
