#!/usr/bin/env node
/**
 * Bundle the browser half into one classic script.
 *
 * Desktop loads exports["./client"] with a script tag. ESM import is a syntax
 * error there. The file must register through window.__ModuleLoader__.load and
 * pull React from the host module table via require("react").
 */
import { spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const esbuild = process.env.ESBUILD ?? 'esbuild'
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

const result = spawnSync(esbuild, [
  resolve(root, 'src/client/index.js'),
  '--bundle',
  '--format=cjs',
  '--platform=browser',
  '--target=es2022',
  '--legal-comments=none',
  '--charset=utf8',
  '--external:react',
  '--loader:.png=dataurl',
  `--outfile=${outfile}`,
  `--banner:js=${banner}`,
  `--footer:js=${footer}`,
], { stdio: 'inherit' })

if (result.error) {
  console.error(`dsh-korok-forest: failed to run ${esbuild}: ${result.error.message}`)
  process.exit(1)
}
process.exit(result.status ?? 1)
