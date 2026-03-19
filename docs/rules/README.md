# CareNet 2 — AI Agent Rules (Master Index)

You are working on **CareNet 2**, a healthcare marketplace PWA + mobile app for Bangladesh.
Read all four rule files below before writing any code. They are the single source of truth.

## Rule Files

| File | Contents |
|---|---|
| [01-tech-stack.md](./01-tech-stack.md) | Every library/tool used — React 18, Vite, Tailwind v4, Supabase, Dexie, Capacitor, i18next, Vitest, Playwright |
| [02-architecture.md](./02-architecture.md) | Folder structure, roles system, component/service/auth/realtime/offline patterns |
| [03-coding-style.md](./03-coding-style.md) | TypeScript rules, naming conventions, import order, do/don't checklist |
| [04-testing.md](./04-testing.md) | Vitest + Playwright patterns, mock helpers, offline simulation, a11y testing |

## Quick Reference — The 10 Commandments

1. **React 18 + TypeScript strict** — no `any`, no class components
2. **Tailwind v4 Oxide** — `@import "tailwindcss"`, use `cn.*` object for colours
3. **Supabase only** for DB/Auth/Realtime — with `USE_SUPABASE` flag + mock fallback always present
4. **Dexie + sync engine** for offline — write to Dexie first, queue for Supabase
5. **React Router v7** with lazy `p()` helper — all routes in `src/app/routes.ts`
6. **i18next en + bn** — every string must use `t()`, update both locale files
7. **Capacitor** for native — run `npx cap sync` after build changes
8. **Accessibility** — `aria-hidden`, `aria-label`, `document.title`, focus management
9. **Role system** — 7 roles (guardian/caregiver/patient/agency/admin/moderator/shop), always use `user.activeRole`
10. **Tests** — Vitest for units, Playwright for e2e, including offline and mobile viewport tests

## Project Context

- **168 pages** across 7 role portals — all routes in `src/app/routes.ts`
- **Supabase is already live** — migrations have been run, do not suggest re-running them
- **Mock fallback** is active until `VITE_SUPABASE_URL` env var is set
- **Bangladesh market** — all payment flows use bKash/Nagad/bank transfer, amounts in BDT (৳)
- **Bangla is primary language** for end users — English for admin/dev interfaces

## Never Suggest
❌ Redux / Zustand / Jotai (we have AuthContext + Dexie)
❌ Next.js (we use Vite)
❌ Expo / React Native (we use Capacitor)
❌ Firebase (we use Supabase)
❌ TanStack Query (we use direct Supabase + Dexie)
❌ Prisma (Supabase manages the DB)
❌ moment.js / dayjs (we use date-fns v3)
