import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')

test('browser half is a classic ModuleLoader script', () => {
  assert.match(source, /^window\.__ModuleLoader__\.load\(\{/)
  assert.match(source, /id: "dsh-korok-forest"/)
  assert.match(source, /require\("react"\)/)
  assert.match(source, /return module\.exports;/)
  assert.doesNotMatch(source, /^\s*import\s/m)
  assert.doesNotMatch(source, /^\s*export\s/m)
  assert.match(source, /呀哈哈森林/)
  assert.match(source, /data:image\/png;base64,/)

  let registration
  const window = {
    __ModuleLoader__: {
      load(value) {
        registration = value
      },
    },
  }
  vm.runInNewContext(source, { window }, { filename: 'lib/client.js' })
  const plugin = registration.factory((specifier) => {
    assert.equal(specifier, 'react')
    return {
      createElement() {},
      useState() {},
      useSyncExternalStore() {},
    }
  })
  assert.equal(plugin.name, 'dsh-korok-forest')
  assert.equal(JSON.stringify(plugin.inject), JSON.stringify(['theme', 'slots', 'sessions']))
  assert.equal(typeof plugin.apply, 'function')
})
