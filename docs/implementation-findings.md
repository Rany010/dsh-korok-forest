# Stage 0 findings

Target checkout: `the local DeepSeek Harness checkout`

- Commit: `fcc0ad462172522aaf5c93a7b2e01f6b9f0b0159`
- Version: `0.2.2-rc.1` (`package.json` of `@deepseek-ai/dsh-root`)
- Package manager declared by that tree: `pnpm@11.28.5`
- This plugin declares `engines.dsh`: `>=0.2.2-rc.1 <0.3.0`

## What the host actually exposes

| Need | Evidence | Decision |
|---|---|---|
| Theme override | `ThemeRuntime.overrideTokens` in `packages/client/ui-theme/src/client/index.ts`. Values must be `{ light, dark }`. The presenter writes them as inline custom properties on `body`. | Use this. Do not call `setTheme` with a third-party id; those ids do not enter the built-in settings schema. Morning and glow follow the user's existing light / dark / system preference. |
| Plugin shape | `docs/user/develop/basic/publish.md`. A bundle is `package.json` `dsh.bundle.patch` plus a host `apply`. Browser code is `exports["./client"]` plus `dsh.client.platform = web`. | This repo is that bundle. |
| Home and session mount | `conversation.hero.frame` is an HOC around the scroll body, including the composer (`ui-conversation` `ConversationContent.tsx`). Official art uses `display: contents` so the scroll body stays a flex item. | Pet layer uses the same wrapper. Session pet sits above the composer (`bottom: 128px`) until a real screenshot pass. |
| Settings page | `settings.section` list slot. `label` is registrant text. | One page, id `korok-forest`. |
| Agent running | `api-session/status(sessionId, running: boolean)` in `packages/api/session-controller/src/types.ts`. | Not subscribed. A boolean cannot split thinking from tool execution, and the design forbids guessing. |
| Permission | `approval/request` is a remote waterfall. `ui-approval` consumes it and does not always call `next()`. A later plugin would miss the event; an earlier one could change approval behavior. | Not subscribed. Pet does not enter `waiting_permission` from the live host. |
| Task completion id | No forwarded remote event carries `turn/end` plus `reason.kind` and a stable task id. `api-session/status` going false is also cancel and failure. | Automatic seed awards stay off (`automatic: true` returns `automatic-disabled`). |
| Persistent plugin settings | Host settings are schema namespaces owned by a plugin config. This bundle has no host config schema. | Browser `localStorage` key `dsh-korok-forest/v1`. Per browser profile, not synced. |
| Syntax colors | `shiki.css` owns syntax. `docs/web-styling.md` and the theme README say token sheets are the color authority. | No Shiki variables are overridden. |

## Not done in this build

- No host screenshot comparison. Install and look at home, session, diff, and settings before calling the theme finished.
- Sidebar leaf texture is stored as `sidebarTexture` and forced unused. There is no verified sidebar paint hook that can be removed cleanly.
- Seven poses are single frames. CSS only breathes idle/sleep and bobs working. Settings preview is the only way to see the other poses.
- Reference DSH screenshots from the design pack are not in this repo.
