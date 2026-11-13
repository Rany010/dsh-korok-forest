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
| Agent pose | Root slot prop `useSessionStatus` (`running`, `pendingInteraction`) plus the retained session `eventSource` (`tool/call`, `tool/result`, `turn/end.reason.kind`). The first window is a baseline. | Wired. Permission is read from the status map and does not subscribe to `approval/request`. An open tool call is working; a running turn without one is thinking. A newly appended `turn/end` flashes success, failure, or cancel. `running === false` without that event is cancel. Seeds stay off: there is still no stable award id. |
| Persistent plugin settings | Host settings are schema namespaces owned by a plugin config. This bundle has no host config schema. | Browser `localStorage` key `dsh-korok-forest/v1`. Per browser profile, not synced. |
| Syntax colors | `shiki.css` owns syntax. `docs/web-styling.md` and the theme README say token sheets are the color authority. | No Shiki variables are overridden. |

## Not done in this build

- No host screenshot comparison. Install and look at home, session, diff, and settings before calling the theme finished.
- Sidebar leaf texture is stored as `sidebarTexture` and forced unused. There is no verified sidebar paint hook that can be removed cleanly.
- Seven poses are single frames. CSS breathes idle/sleep, tilts thinking, and bobs working. Success, failure, and permission stay on their still frames.
- Reference DSH screenshots from the design pack are not in this repo.
