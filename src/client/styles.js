const STYLE_ID = 'dsh-korok-forest-style'

const CSS = `
.korok-frame { display: contents; }
.korok-scene {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--korok-scene-image) 56% 42% / cover no-repeat;
  opacity: var(--korok-scene-opacity, .88);
}
.korok-frame > [data-conversation-scroll] { position: relative; }
[data-conversation-content]:has(.korok-frame) { background-color: var(--korok-read-wash); }
.korok-scene[data-view="session"] {
  background-image: var(--korok-session-image);
  /* Keep the host's adjustable transcript width plus its horizontal padding opaque. */
  mask-image: linear-gradient(to right,
    #000 0, #000 max(0px, calc(50% - var(--dsh-chat-content-width, 920px) / 2 - 152px)),
    #0009 max(0px, calc(50% - var(--dsh-chat-content-width, 920px) / 2 - 98px)),
    #0002 max(0px, calc(50% - var(--dsh-chat-content-width, 920px) / 2 - 58px)),
    transparent max(0px, calc(50% - var(--dsh-chat-content-width, 920px) / 2 - 32px)),
    transparent min(100%, calc(50% + var(--dsh-chat-content-width, 920px) / 2 + 32px)),
    #0002 min(100%, calc(50% + var(--dsh-chat-content-width, 920px) / 2 + 58px)),
    #0009 min(100%, calc(50% + var(--dsh-chat-content-width, 920px) / 2 + 98px)),
    #000 min(100%, calc(50% + var(--dsh-chat-content-width, 920px) / 2 + 152px)), #000 100%);
}
.korok-scene[data-view="home"] {
  top: calc(-1 * var(--korok-header-height, 0px));
  background-size: var(--korok-scene-width, auto) var(--korok-scene-height, 100%);
  background-position: var(--korok-scene-x, center) var(--korok-scene-y, center);
}
.korok-frame [data-composer-seat] { background: var(--korok-read-wash); }
.korok-frame[data-hero="true"] [data-composer-seat] {
  background: transparent;
}
/* Installed ConversationContent renders this slot directly inside composerStack.
   Its first child is HeroShell, followed by workspace controls and InputBar.
   Keep the actual textarea mounted throughout the hero/session transition. */
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) {
  position: relative;
  padding-bottom: 24px;
  max-width: 932px;
  width: min(932px, 94%);
}
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:first-child {
  height: auto;
  margin-bottom: clamp(184px, calc(var(--korok-viewport-height) * .22), 218px);
}
.korok-frame[data-hero="true"][data-pet-visible="false"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:first-child {
  margin-bottom: 32px;
}
.korok-frame[data-hero="true"] div:has(> span > [data-slot="conversation.hero.brand.mark"]) {
  width: fit-content;
  max-width: 100%;
  align-self: center;
  box-sizing: border-box;
  padding: 8px 16px;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) {
  background: transparent;
  border-radius: 0;
  align-self: center;
  max-width: calc(100% - 32px);
  padding: 4px 0 14px;
  width: calc(100% - 32px);
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.korok-frame [data-slot="conversation.composer.bar"] > div {
  box-shadow: 0 8px 28px #00000012;
}
.korok-frame [data-conversation-scroll]:has([data-conversation-composer-overlay]) {
  background: var(--korok-read-wash);
}
/* Verified 0.2.2-rc.3 slot anchors. Replace host heading/badge with real accessible text. */
.korok-frame div:has(> span > [data-slot="conversation.hero.brand.mark"]) > span:has(.korok-hero) + span { display: none; }
.korok-hero { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; color: #f4f2d8; text-shadow: 0 2px 6px #122619, 0 0 26px #122619; padding: 0 12px; background: none; }
.korok-hero-ornament { display: block; color: #e5e3ae; }
.korok-hero-title { font-family: 'Noto Serif SC', 'Microsoft YaHei', serif; font-size: clamp(28px, 3vw, 44px); line-height: 1.3; font-weight: 500; letter-spacing: .08em; }
.korok-hero-subtitle { font-size: 14px; line-height: 1.65; font-weight: 400; letter-spacing: .04em; max-width: 640px; }
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > div:has([data-slot="conversation.hero.options"]) { order: -1; width: 100%; margin: 0 0 6px; justify-content: center; }
.korok-starters { display: flex; justify-content: center; flex-wrap: wrap; gap: clamp(10px, 2vw, 24px); width: 100%; }
.korok-starters button,
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > button,
.korok-frame [data-slot="conversation.hero.agentPreset"] button {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  border: 1px solid #cbd4aa80; border-radius: 999px; padding: 8px 18px; min-height: 36px;
  color: #f4f2dc; background: #33482b99; backdrop-filter: blur(10px); font: inherit; font-size: 13px; cursor: pointer;
  --dsw-alias-label-primary: #f4f2dc; --dsw-alias-label-secondary: #e1e7ce; --dsw-alias-label-caption: #d1dcc3;
}
body[data-ds-dark-theme] .korok-starters button,
body[data-ds-dark-theme] .korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > button,
body[data-ds-dark-theme] .korok-frame [data-slot="conversation.hero.agentPreset"] button { background: #123e34a6; }
.korok-starters button:hover:not(:disabled) { background: #526c38; }
.korok-starters button:disabled { opacity: .5; cursor: default; }
.korok-starters button:focus-visible { outline: 2px solid #f4f2dc; outline-offset: 3px; }
/* Resident workspace and preset controls join the real composer toolbar.
   Geometry comes from the host's add button; the same buttons keep their menus. */
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > button,
.korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] button {
  position: absolute; z-index: 12; top: var(--korok-tools-y, 0px); left: var(--korok-tools-x, 0px);
  min-height: 28px; height: 28px; width: 34px; padding: 4px; border: 0; border-radius: 6px;
  background: transparent; backdrop-filter: none; color: #445947; font-size: 0;
  --dsw-alias-label-primary: #445947; --dsw-alias-label-secondary: #445947; --dsw-alias-label-caption: #52634e;
}
.korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] > div:has(> button) {
  position: absolute; z-index: 12; top: var(--korok-tools-y, 0px); left: calc(var(--korok-tools-x, 0px) + 38px);
  width: 34px; min-width: 34px; height: 28px;
}
.korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] button { position: static; gap: 0; }
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > button > span { display: none; }
.korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] button > span { font-size: 0; }
.korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] button > svg:last-child { display: none; }
body[data-ds-dark-theme] .korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] button,
body[data-ds-dark-theme] .korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > button { background: transparent; }
/* Slots use display:contents, so spacing belongs on the real modes flex box. */
.korok-frame[data-hero="true"] [data-composer-card] div:has(> [data-slot="conversation.input.permission"]) { margin-left: 78px; }
.korok-frame[data-hero="true"] [data-slot="conversation.hero.agentPreset"] button:hover,
.korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:nth-child(2) > button:hover { background: #dce4cc; }
/* Cream composer in both appearances; menus outside the card keep their theme. */
.korok-frame [data-composer-card] {
  --dsw-specific-input-major: #f1f0df;
  --dsw-alias-label-primary: #263d30;
  --dsw-alias-label-secondary: #445947;
  --dsw-alias-label-tertiary: #52634e;
  --dsw-alias-label-caption: #5a6955;
  --dsw-alias-label-dimmed: #6b7866;
  --dsw-alias-interactive-bg-hover: #dce4cc;
  --dsw-alias-button-floating-fill: #e0e4d1;
  --dsw-specific-selector: #dde1cc;
  --dsw-alias-interactive-bg-hover-solid: #d2ddbf;
  --dsw-alias-button-info-fill: #4d723d;
  --dsw-alias-button-info-hover: #355a2d;
  --dsw-alias-label-on-color: #ffffff;
  color: #263d30; background: #f1f0df; border: 1px solid #879b78; border-radius: 24px;
  box-shadow: 0 12px 36px #0e231622;
}
body[data-ds-dark-theme] .korok-frame [data-composer-card] { --dsw-alias-button-info-fill: #2f654b; --dsw-alias-button-info-hover: #214b37; }
/* Theme the real navigation while preserving its resize/collapse/menu actions. */
[data-slot="sidebar"] > div {
  --dsw-specific-sidebar-fill: #30452b;
  --dsw-alias-label-primary: #f4f2df; --dsw-alias-label-secondary: #e0e5ce;
  --dsw-alias-label-tertiary: #ccd8bb; --dsw-alias-label-caption: #ccd8bb;
  --dsw-alias-label-primary-bluish: #dce9b3;
  --dsw-alias-interactive-bg-hover: #ffffff18;
  --dsw-specific-sidebar-nav-item-active: #647a46a6;
  --dsw-specific-sidebar-nav-item-active-accent: #647a46a6;
  --dsw-alias-state-business-primary: #d4e6a5;
  --dsw-alias-brand-primary-new-colorprimary-new-color: #d4e6a5;
  --dsw-alias-border-l3: #a5b48a70;
  background: linear-gradient(180deg, #354529f5, #30452bea 68%, #24452a99), var(--korok-scene-image) 18% bottom / auto 100% no-repeat;
  border-right: 1px solid #a7b98a55;
  color: #f4f2df;
}
body[data-ds-dark-theme] [data-slot="sidebar"] > div {
  --dsw-specific-sidebar-fill: #0e332b;
  --dsw-specific-sidebar-nav-item-active: #38694da6;
  --dsw-specific-sidebar-nav-item-active-accent: #38694da6;
  background: linear-gradient(180deg, #0b2c25f5, #0e332bec 68%, #103b3199), var(--korok-scene-image) 18% bottom / auto 100% no-repeat;
}
[data-slot="sidebar.session.action"] button {
  --dsw-alias-label-primary: #273e30;
  background: #eeeed8; color: #273e30; border: 1px solid #b6c399; border-radius: 10px;
}
[data-slot="sidebar.session.action"] button:hover { background: #dce5c7; }
[data-slot="sidebar"] [aria-selected="true"] { border-radius: 8px; box-shadow: none; }
[data-slot="sidebar"] [aria-selected="true"]::before { content: ''; display: inline-block; width: 14px; height: 14px; margin-right: 6px; background: #d7e7a8; mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M4 19C1 8 8 2 21 3c0 13-6 20-17 16ZM4 19 16 8' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E") center / contain no-repeat; }
[data-slot="sidebar"] div:has(> [data-sidebar-scrollport]) > span[aria-hidden="true"] { display: none; }
.korok-brand-name { display: flex; flex-direction: column; align-items: flex-start; gap: 3px; line-height: 1.2; }
.korok-brand-name strong { font-size: 13px; font-weight: 600; }
.korok-brand-name small { font-size: 10px; font-weight: 400; opacity: .8; }
body[data-korok-background="off"] [data-slot="sidebar"] > div { background-image: none; background-color: #30452b; }
body[data-ds-dark-theme][data-korok-background="off"] [data-slot="sidebar"] > div { background-color: #0e332b; }
[data-phase="hero"]:has(.korok-frame) > [data-slot="conversation.header"] > :first-child {
  position: relative; z-index: 3; background: transparent; color: #eff2db; --dsw-alias-label-primary: #eff2db; --dsw-alias-label-secondary: #dce4cd;
}
.korok-pet {
  position: absolute;
  z-index: 2;
  margin: 0;
  pointer-events: none;
}
.korok-say {
  animation: korok-speech 4s forwards;
  position: absolute;
  right: calc(100% + 6px);
  bottom: 70%;
  pointer-events: none;
  white-space: nowrap;
  font-size: 11px;
  line-height: 1.2;
  padding: 4px 8px;
  border-radius: 8px;
  background: var(--dsw-alias-toast-bg);
  color: var(--dsw-alias-toast-label);
}
.korok-pet img {
  display: block;
  width: 80px;
  height: 80px;
  object-fit: contain;
  pointer-events: auto;
  user-select: none;
  -webkit-user-drag: none;
  touch-action: none;
  filter: drop-shadow(0 4px 4px #00000022);
}
.korok-pet[data-size="S"] img { width: 72px; height: 72px; }
.korok-pet[data-size="L"] img { width: 88px; height: 88px; }
.korok-frame[data-pet-docked="true"] [data-composer-seat] { padding-top: calc(var(--korok-session-pet-size) + 24px); }
.korok-frame[data-pet-docked="true"] .korok-pet[data-placement="session"] {
  left: auto !important; top: auto !important; right: 24px !important;
  bottom: calc(var(--korok-composer-height) - var(--korok-session-pet-size) - 12px) !important;
  z-index: 10;
}
.korok-frame[data-pet-docked="true"] .korok-say { bottom: 35%; max-width: calc(100vw - 150px); white-space: normal; }
.korok-pet[data-placement="home"] {
  top: var(--korok-home-pet-top, calc(50% - 100px));
  left: calc(50% - var(--korok-foot-x, 88px));
  transform: none;
}
.korok-pet[data-placement="home"]::after { content: ''; position: absolute; z-index: -1; left: var(--korok-foot-x, 88px); top: var(--korok-foot-y, 165px); width: 58px; height: 11px; transform: translate(-50%, -50%); border-radius: 50%; background: #14271599; filter: blur(4px); }
.korok-pet[data-placement="home"] img { transform-origin: var(--korok-foot-x, 50%) var(--korok-foot-y, 94%); }
.korok-pet[data-placement="home"] img {
  width: var(--korok-home-pet-size, 176px);
  height: var(--korok-home-pet-size, 176px);
  pointer-events: none;
}
.korok-pet[data-motion="standard"][data-state="idle"] img,
.korok-pet[data-motion="standard"][data-state="sleep"] img {
  animation: korok-breathe 3.6s ease-in-out infinite;
}
.korok-pet[data-placement="home"][data-motion="standard"] img { animation: korok-grounded-breathe 3.6s ease-in-out infinite; }
@keyframes korok-grounded-breathe { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(1.015); } }
.korok-pet[data-motion="standard"][data-state="thinking"] img {
  animation: korok-tilt 2.4s ease-in-out infinite;
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
@keyframes korok-speech {
  0%, 85% { visibility: visible; }
  100% { visibility: hidden; }
}
.korok-pet[data-state="idle"] .korok-say,
.korok-pet[data-state="sleep"] .korok-say { display: none; }
@keyframes korok-tilt {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-4deg); }
}
@keyframes korok-bob {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}
.korok-settings {
  --ks-card: #fbfcf8; --ks-muted: #eff3e9; --ks-border: #d9e2d1; --ks-text: #273c2d;
  --ks-secondary: #5b6c5d; --ks-accent: #426d42; --ks-selected: #e3edd8;
  display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 760px;
  color: var(--ks-text); font-family: var(--dsw-font-family, system-ui, sans-serif); font-size: 14px; line-height: 1.5;
  container-type: inline-size; padding-bottom: 24px;
}
body[data-ds-dark-theme] .korok-settings {
  --ks-card: #142f29; --ks-muted: #1c3b31; --ks-border: #345348; --ks-text: #edf1df;
  --ks-secondary: #b1c3b4; --ks-accent: #8ab780; --ks-selected: #294d3b;
}
.korok-settings *, .korok-settings *::before, .korok-settings *::after { box-sizing: border-box; }
.korok-settings h2, .korok-settings h3, .korok-settings p { margin: 0; }
.korok-settings h2 { font-size: 22px; font-weight: 650; letter-spacing: .02em; }
.korok-settings h3 { font-size: 15px; font-weight: 600; }
.korok-settings p { color: var(--ks-secondary); font-size: 12px; line-height: 1.6; }
.korok-settings-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.korok-settings-heading p { margin-top: 4px; }
.korok-settings-tag { display: inline-flex; flex: none; border: 1px solid var(--ks-border); border-radius: 99px; padding: 3px 9px; color: var(--ks-secondary); font-size: 11px; font-weight: 400; }
.korok-settings-card { padding: 20px; border: 1px solid var(--ks-border); border-radius: 16px; background: var(--ks-card); }
.korok-section-heading { margin-bottom: 16px; }
.korok-section-heading p { margin-top: 3px; }
.korok-theme-previews { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-bottom: 12px; }
.korok-theme-previews figure { position: relative; margin: 0; border-radius: 10px; overflow: hidden; height: 116px; background: #17372e; }
.korok-theme-previews img { width: 100%; height: 100%; object-fit: cover; object-position: center 55%; }
.korok-theme-previews figcaption { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: end; padding: 12px; color: #fffbe7; background: linear-gradient(transparent 20%, #102b25d9); }
.korok-theme-previews strong { font-size: 14px; font-weight: 550; }
.korok-theme-previews figcaption span { font-size: 11px; margin-top: 1px; }
.korok-setting-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 66px; padding: 12px 0; }
.korok-setting-row + .korok-setting-row { border-top: 1px solid var(--ks-border); }
.korok-setting-row:last-child { padding-bottom: 0; }
.korok-setting-label { min-width: 0; }
.korok-setting-label > span { font-size: 13px; font-weight: 500; }
.korok-setting-label p { margin-top: 3px; }
.korok-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.korok-settings button { font: inherit; font-size: 12px; cursor: pointer; color: var(--ks-text); }
.korok-settings button:focus-visible, .korok-settings input:focus-visible, .korok-settings summary:focus-visible { outline: 2px solid var(--ks-accent); outline-offset: 3px; }
.korok-segmented { display: inline-flex; flex: none; gap: 3px; padding: 3px; background: var(--ks-muted); border: 1px solid var(--ks-border); border-radius: 9px; }
.korok-segmented button { min-width: 44px; min-height: 30px; padding: 4px 12px; border: 1px solid transparent; border-radius: 6px; background: transparent; white-space: nowrap; }
.korok-segmented button[aria-pressed="true"] { background: var(--ks-card); border-color: var(--ks-border); color: var(--ks-accent); font-weight: 600; box-shadow: 0 1px 3px #102b2510; }
.korok-segmented button:hover:not([aria-pressed="true"]) { background: var(--ks-selected); }
.korok-settings .korok-switch { flex: none; width: 38px; height: 22px; padding: 3px; border: 0; border-radius: 99px; background: #859581; }
.korok-switch span { display: block; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px #0002; transition: transform .15s; }
.korok-settings .korok-switch[aria-checked="true"] { background: #49784e; }
.korok-switch[aria-checked="true"] span { transform: translateX(16px); }
.korok-range { display: flex; align-items: center; gap: 12px; width: 236px; max-width: 60%; }
.korok-range input { flex: 1; min-width: 0; width: 100%; accent-color: var(--ks-accent); cursor: pointer; }
.korok-range input:disabled { opacity: .4; cursor: default; }
.korok-range output { min-width: 35px; text-align: right; font-size: 12px; color: var(--ks-secondary); font-variant-numeric: tabular-nums; }
.korok-preview-heading { display: flex; justify-content: space-between; gap: 8px; margin: 16px 0 10px; font-size: 12px; }
.korok-preview-heading span:last-child { color: var(--ks-secondary); font-size: 11px; }
.korok-state-previews { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; }
.korok-state-previews button { min-width: 0; display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 6px 2px 8px; background: var(--ks-muted); border: 1px solid transparent; border-radius: 9px; font-size: 11px; white-space: nowrap; }
.korok-state-previews button[aria-pressed="true"] { background: var(--ks-selected); border-color: var(--ks-accent); color: var(--ks-accent); }
.korok-state-previews button:hover { border-color: var(--ks-accent); }
.korok-preview-art { height: 64px; display: flex; align-items: end; justify-content: center; width: 100%; }
.korok-preview-art img { width: var(--korok-preview-size); height: var(--korok-preview-size); max-width: 100%; object-fit: contain; }
.korok-state-previews[data-motion="standard"] button[aria-pressed="true"][data-state="idle"] img,
.korok-state-previews[data-motion="standard"] button[aria-pressed="true"][data-state="sleep"] img { animation: korok-breathe 3.6s ease-in-out infinite; }
.korok-state-previews[data-motion="standard"] button[aria-pressed="true"][data-state="thinking"] img { animation: korok-tilt 2.4s ease-in-out infinite; }
.korok-state-previews[data-motion="standard"] button[aria-pressed="true"][data-state="working"] img { animation: korok-bob 1.1s ease-in-out infinite; }
.korok-settings .korok-secondary, .korok-settings .korok-reset { flex: none; border: 1px solid var(--ks-border); border-radius: 8px; background: transparent; padding: 6px 12px; }
.korok-settings .korok-secondary:hover, .korok-settings .korok-reset:hover { background: var(--ks-selected); }
.korok-collection summary { cursor: pointer; display: list-item; font-size: 13px; font-weight: 500; }
.korok-collection summary .korok-settings-tag { float: right; }
.korok-collection[open] summary { margin-bottom: 12px; }
.korok-settings-footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; }
.korok-settings .korok-text-button { padding: 4px 0; border: 0; background: none; color: var(--ks-secondary); text-decoration: underline; text-underline-offset: 3px; }
.korok-reset-confirm { width: 100%; border: 1px solid var(--ks-border); border-radius: 10px; padding: 12px; background: var(--ks-muted); }
.korok-reset-confirm .korok-row { justify-content: end; margin-top: 10px; }
@container (max-width: 520px) {
  .korok-settings-card { padding: 16px; }
  .korok-state-previews { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .korok-setting-row { flex-wrap: wrap; gap: 8px; }
  .korok-setting-label { flex: 1 1 160px; }
  .korok-preview-heading { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .korok-preview-art img { animation: none !important; }
  .korok-switch span { transition: none; }
}
@media (max-height: 640px) {
  .korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) { padding-bottom: 12px; }
  .korok-frame[data-hero="true"] [data-composer-seat] div:has(> [data-slot="conversation.composer.bar"]) > div:first-child { margin-bottom: 112px; }
  .korok-pet[data-placement="home"] img { width: 100px; height: 100px; }
}
.korok-badges { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 12px; }
.korok-badge { display: flex; flex-direction: column; gap: 2px; padding: 10px; border-radius: 8px; background: var(--ks-muted); color: var(--ks-secondary); font-size: 11px; }
.korok-badge strong { font-size: 12px; font-weight: 500; }
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
