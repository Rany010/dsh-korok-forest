/** Fit a scene while pinning its stump to the live character's feet.
 * Scaling also guarantees every edge remains covered at wide/narrow sizes. */
export function fitScene(width, height, ground, asset) {
  const [imageWidth, imageHeight, anchorX, anchorY] = asset
  const scale = Math.max(
    width / (2 * Math.min(anchorX, imageWidth - anchorX)),
    ground / anchorY,
    (height - ground) / (imageHeight - anchorY),
  )
  return { width: imageWidth * scale, height: imageHeight * scale,
    x: width / 2 - anchorX * scale, y: ground - anchorY * scale }
}
