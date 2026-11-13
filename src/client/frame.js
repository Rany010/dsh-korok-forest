import { createElement, useSyncExternalStore } from 'react'
import { stateArtUrl } from '../pet/art.js'
import { loadSettings, subscribeSettings, updateSettings } from './storage.js'

const SIZES = { S: 64, M: 72, L: 80 }

/**
 * Conversation frame. Home shows a static Korok; a session shows a draggable one.
 * Automatic agent poses stay idle until a verified per-state event exists.
 * @param {{hero?: boolean, children?: import('react').ReactNode}} props
 */
export function KorokFrame({ hero = false, children }) {
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, loadSettings)
  if (settings.petVisible !== true) {
    return createElement('div', { className: 'korok-frame' }, children)
  }
  const placement = hero ? 'home' : 'session'
  const style = hero ? undefined : sessionStyle(settings)
  return createElement(
    'div',
    { className: 'korok-frame' },
    children,
    createElement(
      'div',
      {
        className: 'korok-pet',
        'data-placement': placement,
        'data-size': settings.petSize,
        'data-motion': settings.motion,
        'data-state': 'idle',
        style,
      },
      createElement('img', {
        src: stateArtUrl('idle'),
        alt: '',
        width: hero ? 140 : SIZES[settings.petSize] ?? 72,
        height: hero ? 140 : SIZES[settings.petSize] ?? 72,
        draggable: false,
        onPointerDown: hero ? undefined : (event) => startDrag(event),
      }),
    ),
  )
}

/**
 * @param {object} settings
 * @returns {import('react').CSSProperties}
 */
function sessionStyle(settings) {
  if (typeof settings.petX === 'number' && typeof settings.petY === 'number') {
    return { left: `${settings.petX * 100}%`, top: `${settings.petY * 100}%`, right: 'auto', bottom: 'auto' }
  }
  return { right: '16px', bottom: '128px' }
}

/** @param {PointerEvent} event */
function startDrag(event) {
  if (event.button !== 0) return
  const target = event.currentTarget
  if (!(target instanceof Element)) return
  const bounds = target.closest('[data-conversation-content]')
  if (bounds === null) return
  event.preventDefault()
  const pointerId = event.pointerId
  target.setPointerCapture(pointerId)
  const move = (pointer) => {
    if (pointer.pointerId !== pointerId) return
    const rect = bounds.getBoundingClientRect()
    const petRect = target.getBoundingClientRect()
    const x = clamp((pointer.clientX - rect.left - petRect.width / 2) / rect.width)
    const y = clamp((pointer.clientY - rect.top - petRect.height / 2) / rect.height)
    updateSettings({ petX: x, petY: y })
  }
  const end = (pointer) => {
    if (pointer.pointerId !== pointerId) return
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', end)
    target.removeEventListener('pointercancel', end)
  }
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', end)
  target.addEventListener('pointercancel', end)
}

/** @param {number} value */
function clamp(value) {
  if (Number.isNaN(value)) return 0
  return Math.min(1, Math.max(0, value))
}
