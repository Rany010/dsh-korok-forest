import { createElement as h, useEffect, useState } from 'react'
import { ForestIcon, ForestOrnament } from './icons.js'

/** Observe the same appearance marker used by the installed theme presenter. */
export function useDarkAppearance() {
  const read = () => document.body.hasAttribute('data-ds-dark-theme')
  const [dark, setDark] = useState(read)
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(read()))
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })
    setDark(read())
    return () => observer.disconnect()
  }, [])
  return dark
}

/** The brand slot owns the replacement heading; the host editor stays mounted. */
export function KorokHero() {
  const dark = useDarkAppearance()
  return h('span', { className: 'korok-hero' },
    h(ForestOrnament),
    h('span', { role: 'heading', 'aria-level': 1, className: 'korok-hero-title' }, dark ? '穿越迷失森林' : '探索克洛格森林'),
    h('span', { className: 'korok-hero-subtitle' }, dark
      ? '在迷雾缭绕的森林中，循着微光与指引，探索前方的道路'
      : '与森林的智慧同行，在知识与创造的旅途中发现更多可能'),
  )
}

const STARTERS = [
  ['terminal', '代码与开发', '请帮我实现以下功能：'],
  ['layers', '构建与打包', '请帮我检查项目的构建与打包流程：'],
  ['inspect', '问题排查', '请帮我排查以下问题：'],
  ['spark', '文档与总结', '请帮我整理以下内容并编写文档：'],
]

/** Use public input actions; insert in one undo step and never send a prompt. */
export function KorokStarters({ inputActions, useInput }) {
  const locked = useInput(state => state == null || !['plain', 'claimed'].includes(state.phase))
  return h('span', { className: 'korok-starters', role: 'group', 'aria-label': '开始森林探索' },
    ...STARTERS.map(([icon, label, text]) => h('button', {
      key: label, type: 'button', disabled: locked || !inputActions,
      onClick: event => {
        if (!inputActions) return
        if (inputActions.insertText(text, inputActions.captureInsertion())) {
          event.currentTarget.closest('[data-conversation-content]')?.querySelector('[contenteditable="true"], textarea')?.focus()
        }
      },
    }, h(ForestIcon, { name: icon }), label)),
  )
}

export function KorokBrandName() {
  return h('span', { className: 'korok-brand-name' }, h('strong', null, 'DSH · Korok Forest'), h('small', null, '呀哈哈森林 · V4'))
}
