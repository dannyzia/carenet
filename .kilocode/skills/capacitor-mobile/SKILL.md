---
name: capacitor-mobile
description: CareNet 2 mobile skill for Capacitor configuration, native bridge helpers, safe-area behavior, push registration, back-button handling, and status-bar integration. Use when changes affect native or mobile behavior in this repo.
---

# Capacitor And Native Workflow

Read these files first:
- `capacitor.config.ts`
- `src/frontend/native/`
- `src/app/App.tsx`

Follow these rules:
- Keep native-only calls behind the current platform and capability helpers.
- Preserve safe-area handling, hardware back-button behavior, and status bar integration.
- Recheck push, auth, deep-link, and permission flows when a change touches mobile boot or navigation.
- Prefer shared responsive UI patterns over mobile-only forks unless the native wrapper truly needs special handling.

When a change affects native shells:
1. Build the web bundle if needed.
2. Run `npx cap sync`.
3. Re-verify iOS and Android assumptions before finishing.

Avoid:
- web-only APIs without platform guards
- breaking offline startup assumptions
- adding mobile-specific state outside the existing helpers unless necessary
