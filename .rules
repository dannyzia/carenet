# CareNet 2 Workspace Rules

Generated from the shared source-of-truth pack at `../Rules&Skills/packs/carenet-2`. Edit those source files, then resync instead of editing generated copies by hand.

## Core Stack

Treat the current repo as the source of truth. If a generic template conflicts with code that already ships here, follow the repo.

## Real Stack
- React 18 plus TypeScript on Vite.
- Tailwind CSS v4 is configured through `src/styles/tailwind.css`.
- Motion imports come from `motion/react`.
- Routing uses `react-router`, not `react-router-dom`, with repo helpers in `src/app/routes.ts` and `src/lib/react-router-shim.ts`.
- Supabase service code lives in `src/backend/services/`.
- Offline storage and sync live in `src/backend/offline/`.
- i18n bootstraps from `src/frontend/i18n/` with committed locale JSON in `src/locales/en/` and `src/locales/bn/`.
- Capacitor and native helpers live in `capacitor.config.ts` and `src/frontend/native/`.

## Architecture Landmarks
- Keep route registration in `src/app/routes.ts`.
- Keep app-wide wiring in `src/app/App.tsx`.
- Route auth and session behavior through the existing auth store and context in `src/backend/store/auth/`.

## Do Not Introduce By Default
- Redux, Zustand, Jotai, or TanStack Query.
- Next.js, Expo, React Native, Firebase, or Prisma.
- New top-level architecture layers when the current folders already have a home for the code.

## Typescript React

- Prefer strict, explicit TypeScript over loose inferred shapes for exported helpers and shared hooks.
- Prefer functional components and hooks.
- Import router APIs from `react-router`.
- Use the existing route helper patterns instead of inventing a second routing style.
- Keep role-aware logic tied to `useAuth()` and `user.activeRole`.
- Reuse the current folder structure before creating new app-level abstractions.
- Prefer local state, context already in the repo, or existing service hooks over introducing another global state library.

## Ui Tailwind Motion

- Match the existing Tailwind v4 setup in `src/styles/tailwind.css`.
- Prefer tokenized colors, CSS variables, and shared theme values over new color literals.
- Prefer shared components and Radix-based primitives before creating new widgets.
- Reuse shared UI from `src/frontend/components/shared/`, `src/frontend/components/shell/`, and `src/frontend/components/ui/`.
- Keep design tokens in `src/frontend/theme/tokens.ts` and CSS variables in `src/styles/theme.css`.
- Use MUI when an existing surface already leans on MUI or when the component is materially easier there.
- Import animation helpers from `motion/react`.
- Preserve reduced-motion handling, dark-mode behavior, safe-area helpers, and good touch-target sizes.
- Keep accessibility in view: icon-only controls need labels and decorative icons should stay hidden from assistive tech.

## Supabase Realtime Offline

- Keep `USE_SUPABASE` mock fallback behavior intact.
- Prefer shared helpers like `sbRead`, `sbWrite`, `sb`, and `currentUserId` from `src/backend/services/_sb.ts` when they fit the task.
- Use `supabase.channel(...).on('postgres_changes', ...)` for realtime subscriptions.
- Clean up channels and listeners on teardown.
- If user actions must survive disconnects, route writes through the Dexie queue and sync engine instead of online-only mutations.
- Check `supabase/functions/` and `supabase/migrations/` before changing backend behavior that depends on them.
- Keep conflict-prone flows retry-safe and idempotent where possible.

## I18n Bn En

- Do not hardcode user-facing copy in components when it belongs in translations.
- Add committed strings to both `src/locales/en/` and `src/locales/bn/`.
- Keep using `useTranslation()` and the existing language helpers.
- Remember that the app can load extra admin-managed languages at runtime; do not break that behavior by assuming only two languages exist internally.
- Use the existing scripts when changing many keys: `npm run i18n:sync`, `npm run translate`, and `npm run translate:verify`.
- Preserve locale-aware formatting for currency, dates, and labels where current helpers already exist.

## Testing Vitest Playwright

- Add or update Vitest coverage for new hooks, utilities, and service logic.
- Add or update Playwright coverage for new user-visible flows, especially auth, mobile, offline, realtime, and role-based behavior.
- Vitest defaults to `node`; opt into jsdom only when the test genuinely needs DOM APIs.
- Reuse existing demo or mock-auth patterns instead of inventing a parallel test login flow.
- Use browser network controls such as `context.setOffline(true)` or Chromium network emulation for offline Playwright coverage.
- Prefer behavior assertions over implementation-detail assertions.

## Mobile Capacitor

- Keep native-only calls behind the current platform helpers.
- Recheck `src/frontend/native/` when changing auth, notifications, camera, geolocation, status bar, or back-button behavior.
- Preserve safe-area handling and mobile navigation ergonomics.
- If a change affects native behavior or bundled assets used by native shells, plan for `npm run build` and `npx cap sync`.
- Avoid web-only assumptions that break hybrid wrappers or offline startup.

## Cross Tool Config

- Treat `../Rules&Skills/packs/carenet-2` as the source-of-truth for this project's AI rules and skills when that sibling repo exists.
- Generated project copies should be overwritten by sync, not hand-maintained.
- Cursor should use the modular `.cursor/rules/*.mdc` files.
- Other workspace tools should use the generated combined rule files.
- After material Cursor rule changes, run `npx cursor-doctor scan` and `npx cursor-doctor lint` when available.
