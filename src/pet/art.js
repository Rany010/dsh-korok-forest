import failure from '../../assets/v4/mascot/failure.png'
import idle from '../../assets/v4/mascot/idle.png'
import sleep from '../../assets/v4/mascot/sleep.png'
import success from '../../assets/v4/mascot/success.png'
import thinking from '../../assets/v4/mascot/thinking.png'
import waitingPermission from '../../assets/v4/mascot/waiting_permission.png'
import working from '../../assets/v4/mascot/working.png'

/** Seven static transitional poses supplied by the V4 design pack. */
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
