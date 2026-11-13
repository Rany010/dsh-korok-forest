import failure from '../../assets/character/png/failure.png'
import idle from '../../assets/character/png/idle.png'
import sleep from '../../assets/character/png/sleep.png'
import success from '../../assets/character/png/success.png'
import thinking from '../../assets/character/png/thinking.png'
import waitingPermission from '../../assets/character/png/waiting_permission.png'
import working from '../../assets/character/png/working.png'

/** Display art from the V2 pack. The geometric SVGs stay on disk as the vector source. */
export const STATE_ART = {
  idle,
  thinking,
  working,
  waiting_permission: waitingPermission,
  success,
  failure,
  sleep,
}

/**
 * Image URL for one pose. The bundled client inlines these as PNG data URLs.
 * @param {string} state
 * @returns {string}
 */
export function stateArtUrl(state) {
  return STATE_ART[state] ?? STATE_ART.idle
}
