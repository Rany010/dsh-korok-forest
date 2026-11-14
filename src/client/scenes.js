import dawnlight from '../../assets/v4/backgrounds/light_forest-refined.webp'
import glowmist from '../../assets/v4/backgrounds/dark_forest-refined.webp'
// Keep data URLs below Chromium's CSS custom-property expansion limit.
// The frame masks these supplied session images out of the reading column.
import dawnlightEdge from '../../assets/v4/backgrounds/light_session.webp'

/** Resolved by the host theme presenter, including system appearance changes. */
export function sceneOverrides() {
  return {
    '--korok-scene-image': { light: `url("${dawnlight}")`, dark: `url("${glowmist}")` },
    '--korok-session-image': { light: `url("${dawnlightEdge}")`, dark: `url("${glowmist}")` },
    '--korok-read-wash': { light: '#F8F8F3', dark: '#112724' },
  }
}
