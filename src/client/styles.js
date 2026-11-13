const STYLE_ID = 'dsh-korok-forest-style'

const CSS = `
.korok-frame { display: contents; }
.korok-pet {
  position: absolute;
  z-index: 2;
  margin: 0;
  pointer-events: none;
}
.korok-pet img {
  display: block;
  width: 72px;
  height: 72px;
  pointer-events: auto;
  user-select: none;
  -webkit-user-drag: none;
}
.korok-pet[data-size="S"] img { width: 64px; height: 64px; }
.korok-pet[data-size="L"] img { width: 80px; height: 80px; }
.korok-pet[data-placement="home"] {
  top: 18%;
  left: 50%;
  transform: translateX(-50%);
}
.korok-pet[data-placement="home"] img {
  width: 140px;
  height: 140px;
  pointer-events: none;
}
.korok-pet[data-motion="standard"][data-state="idle"] img,
.korok-pet[data-motion="low"][data-state="idle"] img,
.korok-pet[data-motion="standard"][data-state="sleep"] img {
  animation: korok-breathe 3.6s ease-in-out infinite;
}
.korok-pet[data-motion="standard"][data-state="working"] img {
  animation: korok-bob 1.1s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .korok-pet img { animation: none !important; }
}
@keyframes korok-breathe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes korok-bob {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}
.korok-settings { display: flex; flex-direction: column; gap: 16px; max-width: 640px; color: var(--dsw-alias-label-primary); }
.korok-settings h2 { margin: 0; font-size: 16px; font-weight: 600; }
.korok-settings p { margin: 0; color: var(--dsw-alias-label-secondary); line-height: 1.5; }
.korok-settings fieldset { border: 1px solid var(--dsw-alias-border-l1); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.korok-settings legend { padding: 0 4px; }
.korok-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.korok-settings button {
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
}
.korok-settings button[aria-pressed="true"] {
  background: var(--dsw-alias-button-primary-fill);
  color: var(--dsw-alias-brand-text);
  border-color: var(--dsw-alias-border-l3);
}
.korok-settings button:focus-visible { outline: 2px solid var(--dsw-focus-ring-color); outline-offset: 2px; }
.korok-badges { display: flex; flex-wrap: wrap; gap: 8px; }
.korok-badge {
  min-width: 88px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid var(--dsw-alias-border-l1);
  color: var(--dsw-alias-label-tertiary);
}
`

/** Install plugin CSS once and return the node so unload can remove it. */
export function installKorokStyles() {
  const existing = document.getElementById(STYLE_ID)
  if (existing !== null) existing.remove()
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = CSS
  document.head.append(style)
  return style
}
