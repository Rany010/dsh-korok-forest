import { createElement as h, useState, useSyncExternalStore } from 'react'
import { stateArtUrl } from '../pet/art.js'
import morning from '../../assets/v4/backgrounds/light_forest-refined.webp'
import glow from '../../assets/v4/backgrounds/dark_forest-refined.webp'
import { clearLocalData, loadSettings, subscribeSettings, updateSettings } from './storage.js'

const STATES = ['idle', 'thinking', 'working', 'waiting_permission', 'success', 'failure', 'sleep']
const STATE_LABELS = ['空闲', '思考', '执行中', '等待授权', '完成', '失败', '休眠']
const BADGES = [['初识', 1], ['漫步', 30], ['追踪', 100], ['伙伴', 300], ['守护', 600], ['传说', 900]]

/** Settings page registered into settings.section. Changes save immediately. */
export function KorokSettings() {
  const settings = useSyncExternalStore(subscribeSettings, loadSettings, loadSettings)
  const [preview, setPreview] = useState('idle')
  const [confirmClear, setConfirmClear] = useState(false)
  const [notice, setNotice] = useState('')
  return h('div', { className: 'korok-settings' },
    h('header', { className: 'korok-settings-heading' },
      h('div', null, h('h2', null, '呀哈哈森林'), h('p', null, '让森林陪伴每一次探索')),
      h('span', { className: 'korok-settings-tag' }, '自动保存'),
    ),
    section('森林场景', '晨光与幽光随 DSH 外观自动切换',
      h('div', { className: 'korok-theme-previews' },
        ...[[morning, '克洛格森林', '晨光 · 浅色外观'], [glow, '迷失森林', '幽光 · 深色外观']].map(([src, name, caption]) =>
          h('figure', { key: name }, h('img', { src, alt: '', loading: 'lazy' }),
            h('figcaption', null, h('strong', null, name), h('span', null, caption)))),
      ),
      row('背景显示', '为首页和会话添加森林场景',
        h('div', { className: 'korok-segmented', role: 'group', 'aria-label': '背景档位' },
          ...[['关闭', false, 0], ['柔和', true, 28], ['标准', true, 88]].map(([label, visible, intensity]) =>
            h('button', { key: label, type: 'button',
              'aria-pressed': visible ? settings.backgroundVisible && settings.backgroundIntensity === intensity : !settings.backgroundVisible,
              onClick: () => updateSettings(visible ? { backgroundVisible: true, backgroundIntensity: intensity } : { backgroundVisible: false }),
            }, label)))),
      row('背景强度', null,
        h('div', { className: 'korok-range' }, h('input', {
          type: 'range', min: 0, max: 100, step: 1, 'aria-label': '背景强度',
          'aria-valuetext': `${settings.backgroundIntensity}%`, value: settings.backgroundIntensity,
          disabled: !settings.backgroundVisible,
          onChange: event => updateSettings({ backgroundIntensity: Number(event.target.value) }),
        }), h('output', null, `${settings.backgroundIntensity}%`))),
      row('简约阅读', '隐藏会话背景，保留首页场景',
        toggle('简约阅读', settings.simpleReading, () => updateSettings({ simpleReading: !settings.simpleReading }))),
    ),
    section('森林伙伴', '会话中的桌宠随任务状态变化',
      row('显示桌宠', '窄栏自动停靠，避免遮挡内容',
        toggle('显示桌宠', settings.petVisible, () => updateSettings({ petVisible: !settings.petVisible }))),
      row('桌宠尺寸', null, choice('桌宠尺寸', ['S', 'M', 'L'], settings.petSize,
        petSize => updateSettings({ petSize }), { S: '小', M: '中', L: '大' })),
      row('动效', '低动态仅切换状态，不播放循环动画',
        choice('动效', ['off', 'low', 'standard'], settings.motion, motion => updateSettings({ motion }),
          { off: '关闭', low: '低动态', standard: '标准' })),
      h('div', { className: 'korok-preview-heading' }, h('span', null, '状态预览'),
        h('span', null, '仅预览，不改变任务状态')),
      h('div', { className: 'korok-state-previews', role: 'group', 'aria-label': '状态预览',
        'data-motion': settings.motion, style: { '--korok-preview-size': `${({ S: 46, M: 54, L: 62 })[settings.petSize]}px` } },
        ...STATES.map((state, index) => h('button', {
          key: state, type: 'button', 'aria-pressed': preview === state, 'data-state': state,
          onClick: () => setPreview(state),
        }, h('span', { className: 'korok-preview-art' }, h('img', { src: stateArtUrl(state), alt: '', loading: 'lazy' })), STATE_LABELS[index]))),
      row('桌宠位置', '恢复默认停靠位置', h('button', {
        type: 'button', className: 'korok-secondary',
        onClick: () => { updateSettings({ petX: null, petY: null }); setNotice('桌宠位置已复位') },
      }, '复位位置')),
    ),
    h('details', { className: 'korok-settings-card korok-collection' },
      h('summary', null, h('span', null, '种子收藏'), h('span', { className: 'korok-settings-tag' }, '暂未开放')),
      h('p', null, '自动收集暂未开放，开放后可通过完成任务解锁徽章。'),
      h('div', { className: 'korok-badges' }, ...BADGES.map(([label, goal]) =>
        h('div', { className: 'korok-badge', key: label }, h('strong', null, label), h('span', null, `${goal} 颗种子解锁`)))),
    ),
    h('footer', { className: 'korok-settings-footer' },
      h('p', { role: 'status', 'aria-live': 'polite' }, notice || '设置保存在本机，下次打开时继续生效'),
      confirmClear ? h('div', { className: 'korok-reset-confirm' },
        h('p', null, '将恢复森林外观、桌宠尺寸、动效和位置的默认设置。'),
        h('div', { className: 'korok-row' },
          h('button', { type: 'button', className: 'korok-secondary', onClick: () => setConfirmClear(false) }, '取消'),
          h('button', { type: 'button', className: 'korok-reset', onClick: () => {
            clearLocalData(); setConfirmClear(false); setNotice('已恢复默认设置')
          } }, '确认恢复默认')),
      ) : h('button', { type: 'button', className: 'korok-text-button', onClick: () => setConfirmClear(true) }, '恢复默认设置'),
    ),
  )
}

function section(title, description, ...children) {
  return h('section', { className: 'korok-settings-card', 'aria-label': title },
    h('div', { className: 'korok-section-heading' }, h('h3', null, title), h('p', null, description)), ...children)
}

function row(label, description, control) {
  return h('div', { className: 'korok-setting-row' },
    h('div', { className: 'korok-setting-label' }, h('span', null, label), description && h('p', null, description)), control)
}

function toggle(label, checked, onClick) {
  return h('button', { type: 'button', className: 'korok-switch', role: 'switch', 'aria-label': label, 'aria-checked': checked, onClick },
    h('span', { 'aria-hidden': true }))
}

function choice(label, values, current, onPick, labels) {
  return h('div', { className: 'korok-segmented', role: 'group', 'aria-label': label },
    ...values.map(value => h('button', { type: 'button', key: value, 'aria-pressed': current === value, onClick: () => onPick(value) }, labels[value])))
}
