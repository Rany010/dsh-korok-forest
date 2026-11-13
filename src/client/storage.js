import { defaultSettings, parseSettings } from '../settings/model.js'

const KEY = 'dsh-korok-forest/v1'
const listeners = new Set()

/** Last raw document. Undefined means the cache is empty. */
let cachedRaw
/** Last parsed document. useSyncExternalStore requires this reference to stay stable. */
let cachedSettings

/**
 * Read the stored document without throwing.
 * @returns {string | null}
 */
function readRaw() {
  if (typeof localStorage === 'undefined') return null
  try {
    return localStorage.getItem(KEY)
  } catch (error) {
    console.warn('[dsh-korok-forest] ignored unreadable settings storage', error)
    return null
  }
}

/** @returns {object} */
export function loadSettings() {
  const raw = readRaw()
  if (cachedSettings !== undefined && raw === cachedRaw) return cachedSettings
  cachedRaw = raw
  try {
    cachedSettings = parseSettings(raw)
  } catch (error) {
    console.warn('[dsh-korok-forest] ignored unreadable settings', error)
    cachedSettings = defaultSettings()
  }
  return cachedSettings
}

/** @param {object} settings */
export function saveSettings(settings) {
  const raw = JSON.stringify(settings)
  cachedSettings = settings
  cachedRaw = raw
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(KEY, raw)
    } catch (error) {
      console.warn('[dsh-korok-forest] failed to save settings', error)
    }
  }
  for (const listener of listeners) listener()
}

/**
 * @param {object} patch
 * @returns {object}
 */
export function updateSettings(patch) {
  const next = { ...loadSettings(), ...patch, schemaVersion: 1, seedsAutomatic: false }
  saveSettings(next)
  return next
}

/** @param {() => void} listener @returns {() => void} */
export function subscribeSettings(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function clearLocalData() {
  cachedSettings = undefined
  cachedRaw = undefined
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(KEY)
    } catch (error) {
      console.warn('[dsh-korok-forest] failed to clear settings', error)
    }
  }
  for (const listener of listeners) listener()
}
