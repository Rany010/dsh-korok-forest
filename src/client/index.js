import { themeOverrides } from '../theme/tokens.js'
import { KorokFrame } from './frame.js'
import { bindSessions } from './host.js'
import { KorokSettings } from './settings-panel.js'
import { installKorokStyles } from './styles.js'

/** Browser plugin name. The host half uses the same id. */
export const name = 'dsh-korok-forest'

/** Cordis services required before apply. */
export const inject = ['theme', 'slots', 'sessions']

/**
 * Apply the Korok palette and mount the pet frame plus the settings page.
 * @param {object} ctx - client context with theme and slots.
 */
export function apply(ctx) {
  bindSessions(ctx.sessions)
  ctx.effect(() => {
    const disposeTokens = ctx.theme.overrideTokens('dsh-korok-forest', themeOverrides())
    const style = installKorokStyles()
    return () => {
      disposeTokens()
      style.remove()
    }
  }, 'dsh-korok-forest: theme layer')

  ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
    name: 'conversation.hero.frame',
    id: 'korok-forest',
  }, KorokFrame))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'korok-forest',
    order: 40,
    label: '呀哈哈森林',
  }, KorokSettings))
}
