import { defaultSettings, parseSettings } from '../settings/model.js'

const KEY = 'dsh-korok-forest/v1'
const listeners = new Set()

/** @returns {object} */
export function loadSettings() {
  if (typeof localStorage === 'undefined') return defaultSettings()
  try {
    return parseSettings(localStorage.getItem(KEY))
  } catch (error) {
    console.warn('[dsh-korok-forest] ignored unreadable settings', error)
    return defaultSettings()
  }
}

/** @param {object} settings */
export function saveSettings(settings) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(KEY, JSON.stringify(settings))
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
  if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY)
  for (const listener of listeners) listener()
}
