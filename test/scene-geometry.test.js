import test from 'node:test'
import assert from 'node:assert/strict'
import { fitScene } from '../src/client/scene-geometry.js'

test('stump stays under the character while resized scenes cover every edge', () => {
  for (const asset of [[1672, 941, 836, 562], [1672, 941, 995, 568]]) {
    for (const [width, height] of [[480, 600], [1084, 728], [1158, 860], [1638, 1040]]) {
      for (const ground of [height * .48, height * .58, height * .65]) {
        const scene = fitScene(width, height, ground, asset)
        const scale = scene.width / asset[0]
        assert.ok(Math.abs(scene.x + asset[2] * scale - width / 2) < 1e-6)
        assert.ok(Math.abs(scene.y + asset[3] * scale - ground) < 1e-6)
        assert.ok(scene.x <= 1e-6 && scene.y <= 1e-6)
        assert.ok(scene.x + scene.width >= width - 1e-6)
        assert.ok(scene.y + scene.height >= height - 1e-6)
      }
    }
  }
})
