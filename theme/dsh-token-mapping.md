# Korok semantic token to DSH variable

Source of colors: `theme/semantic-light.json` and `theme/semantic-dark.json`.

Source of variable names: DeepSeek Harness `0.2.2-rc.1` commit `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`, `packages/client/ui-theme/src/styles/design-platform.css`, except `--dsw-focus-ring-color` which is read in `packages/client/ui-theme/src/styles/focus.css`.

`src/theme/tokens.js` `TOKEN_MAP` is the machine-readable copy. Tests fail if a mapped color drifts from the semantic JSON.

| Korok token | DSH variable | Where it paints |
|---|---|---|
| canvas | `--dsw-alias-bg-base` | Document background |
| sidebar | `--dsw-specific-sidebar-fill` | Sidebar column |
| surface | `--dsw-alias-bg-layer-1` | Primary surface |
| surfaceRaised | `--dsw-alias-bg-layer-2` | Raised surface |
| surfaceSubtle | `--dsw-alias-bg-layer-3` | Nested surface |
| surfaceHover | `--dsw-alias-interactive-bg-hover` | Hover fill |
| surfaceSelected | `--dsw-specific-sidebar-nav-item-active` | Selected nav item |
| bubbleUser | `--dsw-specific-bubble` | User bubble |
| input | `--dsw-specific-input-major` | Composer field |
| codeSurface | `--dsw-alias-markdown-code-block` | Code block fill |
| text | `--dsw-alias-label-primary` | Primary text |
| textSecondary | `--dsw-alias-label-secondary` | Secondary text |
| textMuted | `--dsw-alias-label-tertiary` | Muted text |
| textLink | `--dsw-alias-link` | Links |
| textOnAccent | `--dsw-alias-brand-text` | Text on the accent fill |
| borderSubtle | `--dsw-alias-border-l1` | Hairline |
| borderStrong | `--dsw-alias-border-l2` | Strong border |
| borderInteractive | `--dsw-alias-border-l3` | Interactive border |
| accent | `--dsw-alias-brand-primary`, `--dsw-alias-button-primary-fill` | Accent and primary button |
| accentHover | `--dsw-alias-button-primary-hover` | Primary button hover |
| focusRing | `--dsw-focus-ring-color` | Keyboard focus |
| error | `--dsw-alias-state-error-primary` | Error |
| success | `--dsw-alias-state-success-primary` | Success |
| warning | `--dsw-alias-state-warn-primary` | Warning |
| diffAddedBg | `--dsw-alias-file-diff-added-bg` | Added diff fill |
| diffRemovedBg | `--dsw-alias-file-diff-deleted-bg` | Removed diff fill |
| diffAddedText | `--dsw-alias-file-diff-added-marker` | Added diff marker |
| diffRemovedText | `--dsw-alias-file-diff-deleted-marker` | Removed diff marker |
| scrollThumb | `--dsw-alias-scrollbar-bg-l1`, `--dsw-alias-scrollbar-bg-l2` | Scrollbar thumb |
| scrollThumbHover | `--dsw-alias-scrollbar-hover-l1`, `--dsw-alias-scrollbar-hover-l2` | Scrollbar hover |
| toastSurface | `--dsw-alias-toast-bg` | Toast fill |
| toastText | `--dsw-alias-toast-label` | Toast text |
| menuSurface | `--dsw-specific-menu`, `--dsw-menu-surface-fill` | Menu fill |
| overlaySurface | `--dsw-alias-bg-overlay` | Overlay |
| modalScrim | `--dsw-alias-bg-mask-1` | Mask |

Unmapped on purpose: Shiki syntax tokens, user font variables, and `--dsw-alias-code-diff-added` / `--dsw-alias-code-diff-deleted` (those are translucent syntax-diff washes, not the file-diff surfaces).
