#!/usr/bin/env node
/**
 * Bundle the browser half into one classic script.
 *
 * Desktop loads exports["./client"] with a script tag. ESM import is a syntax
 * error there. The file must register through window.__ModuleLoader__.load and
 * pull React from the host module table via require("react").
 */
import { buildSync } from 'esbuild'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outfile = resolve(root, 'lib/client.js')
mkdirSync(dirname(outfile), { recursive: true })

const banner = [
  'window.__ModuleLoader__.load({',
  '  id: "dsh-korok-forest",',
  '  factory: (require) => {',
  '    var module = { exports: {} };',
  '    var exports = module.exports;',
].join('\n')

const footer = [
  '    return module.exports;',
  '  }',
  '});',
].join('\n')

buildSync({
  entryPoints: [resolve(root, 'src/client/index.js')],
  bundle: true,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  legalComments: 'none',
  charset: 'utf8',
  external: ['react'],
  loader: { '.png': 'dataurl', '.webp': 'dataurl' },
  outfile,
  banner: { js: banner },
  footer: { js: footer },
  logLevel: 'info',
})
