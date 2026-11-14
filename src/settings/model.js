const SIZES = new Set(['S', 'M', 'L'])
const MOTION = new Set(['off', 'low', 'standard'])

/** @returns {object} */
export function defaultSettings() {
  return {
    schemaVersion: 1,
    petVisible: true,
    petSize: 'M',
    motion: 'standard',
    seedsAutomatic: false,
    sidebarTexture: false,
    backgroundVisible: true,
    backgroundIntensity: 88,
    simpleReading: false,
    petX: null,
    petY: null,
  }
}

/**
 * Parse a stored settings document.
 * Automatic seeds stay off: this build has no verified award event.
 * @param {string|null|undefined} raw
 * @returns {object}
 */
export function parseSettings(raw) {
  if (raw === null || raw === undefined || raw === '') return defaultSettings()
  const parsed = JSON.parse(raw)
  if (parsed?.schemaVersion !== 1) {
    throw new Error(`Unsupported settings schemaVersion: ${parsed?.schemaVersion}`)
  }
  const defaults = defaultSettings()
  const petX = unit(parsed.petX)
  const petY = unit(parsed.petY)
  return {
    schemaVersion: 1,
    petVisible: typeof parsed.petVisible === 'boolean' ? parsed.petVisible : defaults.petVisible,
    petSize: SIZES.has(parsed.petSize) ? parsed.petSize : defaults.petSize,
    motion: MOTION.has(parsed.motion) ? parsed.motion : defaults.motion,
    seedsAutomatic: false,
    sidebarTexture: parsed.sidebarTexture === true,
    backgroundVisible: typeof parsed.backgroundVisible === 'boolean' ? parsed.backgroundVisible : true,
    backgroundIntensity: typeof parsed.backgroundIntensity === 'number' && Number.isFinite(parsed.backgroundIntensity)
      ? Math.min(100, Math.max(0, parsed.backgroundIntensity)) : defaults.backgroundIntensity,
    simpleReading: parsed.simpleReading === true,
    petX,
    petY,
  }
}

/**
 * @param {unknown} value
 * @returns {number|null}
 */
function unit(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  if (value < 0 || value > 1) return null
  return value
}
