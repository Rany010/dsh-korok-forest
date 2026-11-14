import assert from 'node:assert/strict'
import test from 'node:test'
import light from '../theme/semantic-light.json' with { type: 'json' }
import dark from '../theme/semantic-dark.json' with { type: 'json' }

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(value => {
    const channel = parseInt(value, 16) / 255
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4
  })
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722
}

const pairs = [
  ['text', 'canvas', 4.5], ['text', 'surface', 4.5], ['text', 'input', 4.5],
  ['text', 'codeSurface', 4.5], ['text', 'bubbleUser', 4.5],
  ['textSecondary', 'surface', 4.5], ['textMuted', 'canvas', 4.5],
  ['textOnAccent', 'accent', 4.5], ['textOnAccent', 'accentHover', 4.5],
  ['diffAddedText', 'diffAddedBg', 4.5], ['diffRemovedText', 'diffRemovedBg', 4.5],
  ['terminalText', 'terminalSurface', 4.5], ['tooltipText', 'tooltipSurface', 4.5],
  ['toastText', 'toastSurface', 4.5], ['text', 'overlaySurface', 4.5],
  ['borderInteractive', 'canvas', 3], ['borderInteractive', 'surface', 3],
  ['focusRing', 'surface', 3],
]

for (const palette of [light, dark]) {
  test(`${palette.theme} V4 text and essential outlines meet contrast thresholds`, () => {
    for (const [foreground, background, minimum] of pairs) {
      const values = [luminance(palette.tokens[foreground]), luminance(palette.tokens[background])].sort((a, b) => b - a)
      const ratio = (values[0] + .05) / (values[1] + .05)
      assert.ok(ratio >= minimum, `${foreground}/${background}: ${ratio.toFixed(2)} < ${minimum}`)
    }
  })
}
