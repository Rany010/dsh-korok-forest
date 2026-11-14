import { createElement as h } from 'react'

const paths = {
  terminal: ['m4 6 5 6-5 6', 'M12 18h8'],
  layers: ['m12 3 10 6-10 6L2 9Z', 'm2 13 10 6 10-6', 'm2 17 10 6 10-6'],
  inspect: ['M5 3h14v18H5Z', 'M8 7h8M8 11h8M8 15h5'],
  spark: ['m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z'],
  leaf: ['M4 19C1 8 8 2 21 3c0 13-6 20-17 16Z', 'M4 19 16 8', 'm9 14-1-5m5 1 4 1'],
}
export function ForestIcon({ name, size = 18 }) {
  return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
    ...paths[name].map((d, i) => h('path', { d, key: i })))
}
export function ForestOrnament() {
  return h('svg', { className: 'korok-hero-ornament', width: 240, height: 28, viewBox: '0 0 240 28', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M0 14h86m68 0h86M82 11l5 3-5 3m76-6-5 3 5 3', stroke: 'currentColor' }),
    h('path', { d: 'M119 16C108 17 104 9 105 2c9 0 15 5 14 14Zm4 0c-1-9 5-14 14-14 1 7-3 15-14 14ZM120 17l-6 10h12Zm-10 2-5 8h9m14-8 5 8h-9', fill: 'currentColor' }))
}
