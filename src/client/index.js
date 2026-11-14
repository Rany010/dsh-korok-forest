import { themeOverrides } from '../theme/tokens.js'
import { KorokFrame } from './frame.js'
import { bindSessions } from './host.js'
import { KorokSettings } from './settings-panel.js'
import { installKorokStyles } from './styles.js'
import { sceneOverrides } from './scenes.js'
import { KorokHero, KorokStarters, KorokBrandName } from './hero.js'
import { loadSettings, subscribeSettings } from './storage.js'

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
    const disposeTokens = ctx.theme.overrideTokens('dsh-korok-forest', { ...themeOverrides(), ...sceneOverrides() })
    const style = installKorokStyles()
    const updateScenePreference = () => {
      const settings = loadSettings()
      document.body.dataset.korokBackground = settings.backgroundVisible && settings.backgroundIntensity > 0 ? 'on' : 'off'
    }
    updateScenePreference()
    const unsubscribeSettings = subscribeSettings(updateScenePreference)
    return () => {
      unsubscribeSettings()
      delete document.body.dataset.korokBackground
      disposeTokens()
      style.remove()
      bindSessions(null)
    }
  }, 'dsh-korok-forest: theme layer')

  ctx.slots.inject('conversation.hero.frame', () => ctx.slots.register({
    name: 'conversation.hero.frame',
    id: 'korok-forest',
  }, KorokFrame))

  ctx.slots.inject('conversation.hero.brand.mark', () => ctx.slots.register({
    name: 'conversation.hero.brand.mark', id: 'korok-forest', priority: -10,
  }, KorokHero))

  ctx.slots.inject('sidebar.brand.name', () => ctx.slots.register({
    name: 'sidebar.brand.name', id: 'korok-forest', priority: -10,
  }, KorokBrandName))

  ctx.slots.inject('conversation.hero.options', () => ctx.slots.register({
    name: 'conversation.hero.options', id: 'korok-forest', order: -10,
  }, KorokStarters))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'korok-forest',
    order: 40,
    label: '呀哈哈森林',
  }, KorokSettings))
}
