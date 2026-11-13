import { createElement, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { stateArtUrl } from '../pet/art.js'
import { createPetMachine } from '../pet/machine.js'
import { createObservationCursor, observeHost } from '../pet/observe.js'
import { eventSourceOf } from './host.js'
import { loadSettings, subscribeSettings, updateSettings } from './storage.js'

const SIZES = { S: 64, M: 72, L: 80 }
const EMPTY_WINDOW = { entries: null, change: null }
const SAY = {
  idle: '呀哈哈！',
  thinking: '找到线索啦…',
  working: '森林探索中',
  waiting_permission: '需要你来决定',
  success: '呀哈哈！完成啦！',
  failure: '哎呀，迷路了…',
  sleep: '呼…呼…',
}

/**
 * Conversation frame. Home stays idle. A session follows the open host turn.
 * @param {{hero?: boolean, children?: import('react').ReactNode, useSessionStatus?: Function}} props
 */
export function KorokFrame({ hero = false, children, useSessionStatus }) {
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, loadSettings)
  const [sessionId, frameRef] = useConversationSession()
  const phase = useSessionPhase(useSessionStatus, sessionId)
  const snapshot = useEventWindow(sessionId)
  const pose = usePetPose({
    enabled: hero !== true && settings.petVisible === true,
    sessionId,
    phase,
    snapshot,
  })
  if (settings.petVisible !== true) {
    return createElement('div', { className: 'korok-frame', ref: frameRef }, children)
  }
  const state = hero ? 'idle' : pose
  const style = hero ? undefined : sessionStyle(settings)
  return createElement(
    'div',
    { className: 'korok-frame', ref: frameRef },
    children,
    createElement(
      'div',
      {
        className: 'korok-pet',
        'data-placement': hero ? 'home' : 'session',
        'data-size': settings.petSize,
        'data-motion': settings.motion,
        'data-state': state,
        style,
      },
      hero ? null : createElement('span', { className: 'korok-say' }, SAY[state] ?? SAY.idle),
      createElement('img', {
        src: stateArtUrl(state),
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
 * Read the session id the conversation already publishes on its content root.
 * @returns {[string|null, import('react').RefCallback<Element>]}
 */
function useConversationSession() {
  const nodeRef = useRef(null)
  const [sessionId, setSessionId] = useState(null)
  const setNode = useCallback((node) => {
    nodeRef.current = node
  }, [])
  useEffect(() => {
    const node = nodeRef.current
    if (node === null) return undefined
    const root = node.closest('[data-conversation-content]')
    if (root === null) return undefined
    const read = () => {
      const value = root.getAttribute('data-conversation-session')
      const next = typeof value === 'string' && value !== '' ? value : null
      setSessionId(current => (current === next ? current : next))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ['data-conversation-session'] })
    return () => observer.disconnect()
  }, [])
  return [sessionId, setNode]
}

/**
 * `useSessionStatus` is injected into every root slot. It reads the status map;
 * it does not subscribe to the approval waterfall.
 * @param {Function|undefined} useSessionStatus
 * @param {string|null} sessionId
 * @returns {string}
 */
function useSessionPhase(useSessionStatus, sessionId) {
  const select = (map) => phaseKey(map, sessionId)
  if (typeof useSessionStatus === 'function') return useSessionStatus(select)
  return useSyncExternalStore(emptySubscribe, () => '00', () => '00')
}

/**
 * @param {object|undefined} map
 * @param {string|null} sessionId
 * @returns {string}
 */
function phaseKey(map, sessionId) {
  if (typeof sessionId !== 'string' || map == null || typeof map.get !== 'function') return '00'
  const row = map.get(sessionId)
  if (row == null) return '00'
  return `${row.running === true ? '1' : '0'}${row.pendingInteraction != null ? '1' : '0'}`
}

/**
 * @param {string|null} sessionId
 */
function useEventWindow(sessionId) {
  const source = eventSourceOf(sessionId)
  const subscribe = useCallback((listener) => {
    if (source === null) return () => {}
    return source.subscribe(listener)
  }, [source])
  const getSnapshot = useCallback(() => {
    if (source === null) return EMPTY_WINDOW
    return source.getSnapshot()
  }, [source])
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

/**
 * @param {{enabled: boolean, sessionId: string|null, phase: string, snapshot: {entries?: readonly object[]|null, change?: {kind?: string}|null}}} input
 * @returns {import('../pet/machine.js').PetState}
 */
function usePetPose({ enabled, sessionId, phase, snapshot }) {
  const machine = useRef(null)
  if (machine.current === null) machine.current = createPetMachine()
  const cursor = useRef(createObservationCursor())
  const [state, setState] = useState(/** @type {string} */ ('idle'))

  useEffect(() => {
    const pet = machine.current
    if (pet === null) return undefined
    if (!enabled) {
      cursor.current = createObservationCursor()
      setState(pet.apply({
        kind: 'session_changed',
        sessionId: null,
        at: Date.now(),
        source: 'verified-host-event',
      }))
      return undefined
    }
    const observed = observeHost(cursor.current, {
      sessionId,
      running: phase[0] === '1',
      pending: phase[1] === '1',
      entries: Array.isArray(snapshot.entries) ? snapshot.entries : null,
      changeKind: snapshot.change && snapshot.change.kind ? snapshot.change.kind : null,
      at: Date.now(),
    })
    cursor.current = observed.cursor
    let next = pet.state
    for (let index = 0; index < observed.signals.length; index += 1) {
      next = pet.apply(observed.signals[index])
    }
    setState(next)
    return undefined
  }, [enabled, sessionId, phase, snapshot])

  useEffect(() => {
    const pet = machine.current
    if (!enabled || pet === null) return undefined
    const timer = setInterval(() => {
      setState(pet.apply({
        kind: 'tick',
        sessionId: cursor.current.sessionId,
        at: Date.now(),
        source: 'verified-host-event',
      }))
    }, 15000)
    return () => clearInterval(timer)
  }, [enabled])

  return state
}

/** @param {() => void} _listener */
function emptySubscribe(_listener) {
  return () => {}
}

/**
 * @param {object} settings
 * @returns {import('react').CSSProperties}
 */
function sessionStyle(settings) {
  if (typeof settings.petX === 'number' && typeof settings.petY === 'number') {
    return { left: `${settings.petX * 100}%`, top: `${settings.petY * 100}%`, right: 'auto', bottom: 'auto' }
  }
  return { right: '26px', bottom: '148px' }
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
