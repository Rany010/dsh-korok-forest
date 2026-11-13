import assert from 'node:assert/strict'
import test from 'node:test'
import light from '../theme/semantic-light.json' with { type: 'json' }
import dark from '../theme/semantic-dark.json' with { type: 'json' }
import { TOKEN_MAP, themeOverrides } from '../src/theme/tokens.js'

test('maps canvas onto the verified document background token in both palettes', () => {
  const overrides = themeOverrides()
  assert.deepEqual(overrides['--dsw-alias-bg-base'], {
    light: '#FFFFFF',
    dark: '#1A211D',
  })
})

test('every override is a light and dark color pair', () => {
  const overrides = themeOverrides()
  assert.ok(Object.keys(overrides).length >= 20)
  for (const [name, value] of Object.entries(overrides)) {
    assert.match(name, /^--dsw-/)
    assert.equal(typeof value.light, 'string')
    assert.equal(typeof value.dark, 'string')
    assert.notEqual(value.light, '')
    assert.notEqual(value.dark, '')
  }
})

test('uses the V2 semantic colors for every mapped token', () => {
  const overrides = themeOverrides()
  for (const [semantic, cssName] of TOKEN_MAP) {
    assert.equal(overrides[cssName].light, light.tokens[semantic], cssName)
    assert.equal(overrides[cssName].dark, dark.tokens[semantic], cssName)
  }
})

test('does not override syntax-highlight tokens', () => {
  const names = Object.keys(themeOverrides())
  assert.equal(names.some(name => name.includes('shiki')), false)
})
