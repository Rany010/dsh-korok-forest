import assert from 'node:assert/strict'
import { test } from 'node:test'
import { clearLocalData, loadSettings, updateSettings } from '../src/client/storage.js'

test('loadSettings keeps one snapshot until the document changes', () => {
  const store = new Map()
  globalThis.localStorage = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
  }
  clearLocalData()
  const first = loadSettings()
  assert.equal(loadSettings(), first)
  updateSettings({ petSize: 'L' })
  const next = loadSettings()
  assert.notEqual(next, first)
  assert.equal(next.petSize, 'L')
  assert.equal(loadSettings(), next)
})
