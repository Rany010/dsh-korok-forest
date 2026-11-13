import { createElement, useState, useSyncExternalStore } from 'react'
import { stateArtUrl } from '../pet/art.js'
import { clearLocalData, loadSettings, subscribeSettings, updateSettings } from './storage.js'

const STATES = ['idle', 'thinking', 'working', 'waiting_permission', 'success', 'failure', 'sleep']
const BADGES = [
  ['初识', 1],
  ['漫步', 30],
  ['追踪', 100],
  ['伙伴', 300],
  ['守护', 600],
  ['传说', 900],
]

/** Settings page registered into settings.section. */
export function KorokSettings() {
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, loadSettings)
  const [preview, setPreview] = useState('idle')
  const [confirmClear, setConfirmClear] = useState(false)
  return createElement(
    'div',
    { className: 'korok-settings' },
    createElement('h2', null, '呀哈哈森林'),
    createElement('p', null, '晨光和幽光跟随 DSH 现有的浅色、深色和系统外观，不改你的字体和字号。桌宠自动姿势还没有接入：宿主目前只能提供会话是否在运行，不能区分思考和工具；授权弹层由官方插件消费。种子自动收集已暂停。'),
    createElement(
      'fieldset',
      null,
      createElement('legend', null, '桌宠'),
      createElement(
        'div',
        { className: 'korok-row' },
        toggle('显示', settings.petVisible, () => updateSettings({ petVisible: !settings.petVisible })),
        choice('尺寸', ['S', 'M', 'L'], settings.petSize, (petSize) => updateSettings({ petSize })),
        choice('动效', ['off', 'low', 'standard'], settings.motion, (motion) => updateSettings({ motion })),
        createElement('button', { type: 'button', onClick: () => updateSettings({ petX: null, petY: null }) }, '复位位置'),
      ),
      createElement('img', {
        src: stateArtUrl(preview),
        alt: '',
        width: 96,
        height: 96,
      }),
      createElement(
        'div',
        { className: 'korok-row', role: 'group', 'aria-label': '状态预览' },
        ...STATES.map(state => createElement(
          'button',
          {
            type: 'button',
            key: state,
            'aria-pressed': preview === state,
            onClick: () => setPreview(state),
          },
          state,
        )),
      ),
    ),
    createElement(
      'fieldset',
      null,
      createElement('legend', null, '种子收藏'),
      createElement('p', null, '尚未接入可靠的任务完成事件；种子自动收集已暂停。这里没有模拟数量。'),
      createElement(
        'div',
        { className: 'korok-badges' },
        ...BADGES.map(([label, goal]) => createElement(
          'div',
          { className: 'korok-badge', key: label },
          `${label} 0/${goal}`,
        )),
      ),
      confirmClear
        ? createElement(
          'div',
          { className: 'korok-row' },
          createElement('button', { type: 'button', onClick: () => { clearLocalData(); setConfirmClear(false) } }, '确认清空'),
          createElement('button', { type: 'button', onClick: () => setConfirmClear(false) }, '取消'),
        )
        : createElement('button', { type: 'button', onClick: () => setConfirmClear(true) }, '清空本地数据'),
    ),
  )
}

/**
 * @param {string} label
 * @param {boolean} pressed
 * @param {() => void} onClick
 */
function toggle(label, pressed, onClick) {
  return createElement('button', { type: 'button', 'aria-pressed': pressed, onClick }, pressed ? `${label}：开` : `${label}：关`)
}

/**
 * @param {string} label
 * @param {string[]} values
 * @param {string} current
 * @param {(value: string) => void} onPick
 */
function choice(label, values, current, onPick) {
  return createElement(
    'div',
    { className: 'korok-row', role: 'group', 'aria-label': label },
    ...values.map(value => createElement(
      'button',
      {
        type: 'button',
        key: value,
        'aria-pressed': current === value,
        onClick: () => onPick(value),
      },
      `${label} ${value}`,
    )),
  )
}
