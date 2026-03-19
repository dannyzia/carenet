# CareNet 2 — Tech Stack Rules
> Canonical source of truth. All IDE rule files reference this document.
> Last updated: 2026-03-19

## The One Rule That Overrides Everything
You are working on **CareNet 2** — a healthcare marketplace PWA/mobile app for Bangladesh.
Never suggest Redux, Next.js, Expo, Firebase, React Native, TanStack Query, Prisma, or any
alternative unless explicitly instructed by the developer.

---

## Frontend
| Concern | Tool | Notes |
|---|---|---|
| Framework | React 18 (not 19) | Strict mode enabled |
| Language | TypeScript (strict) | No `any` without a comment explaining why |
| Bundler | Vite 6 | Config in `vite.config.ts` |
| Styling | Tailwind CSS v4 (Oxide) | Use `@import "tailwindcss";` — NOT `@tailwind base/components/utilities` |
| UI Primitives | Radix UI | Preferred for all interactive primitives |
| UI Heavy | MUI v7 | Only when heavy theming or data-grid is needed |
| Routing | React Router v7 | Data router with lazy loading via `p()` helper in `src/app/routes.ts` |
| Animations | Framer Motion (motion v12) | AnimatePresence + route key for page transitions |
| Icons | Lucide React | Always `aria-hidden="true"` on decorative icons |
| Toast | Sonner | Configured in `AuthenticatedLayout` |
| Forms | React Hook Form | Always pair with Zod for validation |
| Date | date-fns v3 | No moment.js, no dayjs |
| Charts | Recharts | Already in deps |

## Backend / Database
| Concern | Tool | Notes |
|---|---|---|
| Database | Supabase PostgreSQL | RLS mandatory on every table |
| Auth | Supabase Auth | JWT sessions, `persistSession: true` |
| Realtime | Supabase Realtime | `supabase.channel('x').on('postgres_changes', ...)` |
| Edge Functions | Supabase Edge Functions | Deno runtime, in `supabase/functions/` |
| Storage | Supabase Storage | For file/document uploads |
| Client | `@supabase/supabase-js` v2 | Singleton in `src/backend/services/supabase.ts` |

### Supabase Toggle
```ts
// src/backend/services/supabase.ts
// USE_SUPABASE auto-detects from env vars — already wired up
export const USE_SUPABASE = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
```
Every service file checks `USE_SUPABASE` before calling Supabase, falling back to mock data.
**Never remove the mock fallback.**

## Mobile / PWA
| Concern | Tool | Notes |
|---|---|---|
| Native wrapper | Capacitor | Always run `npx cap sync` after `pnpm build` |
| PWA | Vite PWA plugin + `src/sw.ts` | Service worker handles offline caching |
| Status bar | `setStatusBarForRole()` in `src/frontend/native/statusBar.ts` | Call on role change |
| Push notifications | Capacitor Push + Supabase Edge Functions | See `supabase/functions/push-notification/` |

## State & Offline
| Concern | Tool | Notes |
|---|---|---|
| Local DB | Dexie.js v4 (IndexedDB) | Schema in `src/backend/offline/db.ts` |
| Sync engine | Custom | `src/backend/offline/syncEngine.ts` — queue → upsert on reconnect |
| Online detection | `useOnlineStatus` hook | In `src/backend/offline/useOnlineStatus.ts` |
| Sync queue | `useSyncQueue` hook | In `src/backend/offline/useSyncQueue.ts` |

**Offline-first pattern:**
1. Write to Dexie immediately (optimistic)
2. If online → also write to Supabase
3. If offline → add to sync queue
4. On reconnect → drain queue to Supabase

## i18n
| Concern | Tool | Notes |
|---|---|---|
| Library | i18next + react-i18next | |
| Locales | English (`en`) + Bangla (`bn`) | Files in `src/locales/en/` and `src/locales/bn/` |
| Usage | `const { t } = useTranslation("common")` | Namespace = filename in locales folder |
| Language switch | `i18n.changeLanguage('bn')` | Persisted via localStorage |
| RTL | Already handled in theme | Bangla is LTR, but layout supports RTL for future Arabic/Urdu |

**Every UI string must use `t()`** — no hardcoded English strings in components.

## Testing
| Concern | Tool | Notes |
|---|---|---|
| Unit / component | Vitest + Testing Library | Config in `vitest.config.ts` |
| E2E | Playwright | Config in `playwright.config.ts`, tests in `e2e/` |
| Mock Supabase | `vi.mock('@/backend/services/supabase')` | Standard pattern |
| Offline e2e | `await page.context().setOffline(true)` | Playwright network control |

Generate Vitest unit tests AND Playwright e2e tests for every new feature.
