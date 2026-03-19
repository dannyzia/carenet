# CareNet 2 — Project Architecture & Coding Style

## Project Identity
- **App name:** CareNet 2
- **Market:** Bangladesh 🇧🇩
- **Type:** Healthcare marketplace — connects Patients / Guardians / Caregivers / Agencies
- **Deployment:** Web PWA (Vercel) + iOS/Android (Capacitor)
- **Supabase project:** Already provisioned and migrated (do not re-run migrations)

---

## Folder Structure (strict — do not reorganise)

```
src/
├── app/
│   ├── App.tsx              # Root app component
│   ├── routes.ts            # ALL routes defined here — lazy loaded via p() helper
│   └── components/          # App-level only (not shared)
├── backend/
│   ├── api/                 # Supabase client + endpoints
│   ├── models/              # TypeScript types per domain (e.g. caregiver.model.ts)
│   ├── offline/             # Dexie DB + sync engine + hooks
│   ├── services/            # One service file per domain (e.g. caregiver.service.ts)
│   ├── store/               # Auth context + global store
│   └── utils/               # Shared backend utilities
├── frontend/
│   ├── auth/                # Auth context, types, mock auth, guards
│   ├── components/
│   │   ├── shell/           # Layout shells: RootLayout, PublicLayout, AuthenticatedLayout, ShopFrontLayout
│   │   ├── navigation/      # BottomNav, PublicNavBar, PublicFooter
│   │   ├── shared/          # Cross-cutting UI: OfflineIndicator, PageSkeleton, ConfirmDialog, etc.
│   │   ├── mobile/          # Mobile-specific: PullToRefresh, SwipeableCard, StickySubmit, etc.
│   │   ├── guards/          # ProtectedRoute, RoleGuard
│   │   └── ui/              # shadcn/Radix primitives (accordion, button, card, dialog, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── i18n/                # i18next configuration
│   ├── native/              # Capacitor bridge utilities (statusBar, registerDevice, etc.)
│   ├── offline/             # Frontend offline hooks
│   ├── pages/               # One folder per role
│   │   ├── admin/
│   │   ├── agency/
│   │   ├── auth/
│   │   ├── billing/
│   │   ├── caregiver/
│   │   ├── community/
│   │   ├── contracts/
│   │   ├── guardian/
│   │   ├── moderator/
│   │   ├── patient/
│   │   ├── public/
│   │   ├── shared/          # Pages accessible by all roles (Settings, Notifications, Messages)
│   │   ├── shop/            # Merchant-side
│   │   ├── shop-front/      # Customer-side shop
│   │   ├── support/
│   │   └── wallet/
│   ├── services/            # Frontend-layer services
│   ├── theme/               # tokens.ts — cn object, roleConfig, Role type
│   └── utils/               # Frontend utilities
├── locales/
│   ├── en/                  # English translation files
│   └── bn/                  # Bangla translation files
└── styles/                  # Global CSS: index.css, theme.css, fonts.css, tailwind.css
```

---

## Roles System

There are **7 roles** in the app. The `Role` type lives in `src/frontend/theme/tokens.ts`:
```ts
type Role = "guardian" | "caregiver" | "patient" | "agency" | "admin" | "moderator" | "shop";
```

Each role has:
- Its own colour (`roleConfig[role].cssVar`, `.gradient`, `.lightBg`, `.label`)
- Its own sidebar nav sections in `AuthenticatedLayout`
- Its own page folder under `src/frontend/pages/[role]/`
- Its own service in `src/backend/services/[role].service.ts`

When creating a new page for a role:
1. Create the page component in `src/frontend/pages/[role]/YourPageName.tsx`
2. Add the route in `src/app/routes.ts` using the `p()` lazy helper
3. Add the nav link in `AuthenticatedLayout` under the correct role section
4. Add i18n keys to `src/locales/en/common.json` AND `src/locales/bn/common.json`

---

## Component Conventions

### File naming
- Pages: `PascalCase` with role prefix — e.g. `CaregiverDashboardPage.tsx`
- Components: `PascalCase` — e.g. `OfflineIndicator.tsx`
- Hooks: `camelCase` with `use` prefix — e.g. `useUnreadCounts.ts`
- Services: `camelCase.service.ts` — e.g. `caregiver.service.ts`
- Models: `camelCase.model.ts` — e.g. `caregiver.model.ts`

### Component structure (always follow this order)
```tsx
// 1. Imports (external → internal → types)
// 2. Types / interfaces
// 3. Constants (outside component)
// 4. Component function
//   a. Hooks (auth, i18n, state, effects)
//   b. Derived values
//   c. Handlers
//   d. Early returns (loading / error states)
//   e. JSX return
// 5. Default export
```

### Styling rules
- Use Tailwind utility classes for layout and spacing
- Use `cn` object from `@/frontend/theme/tokens` for semantic colours — NEVER hardcode hex values
  ```ts
  import { cn, roleConfig } from "@/frontend/theme/tokens";
  style={{ color: cn.text, background: cn.bgPage }}
  ```
- Role colour: always use `var(--${roleConfig[role].cssVar})` or `roleConfig[role].lightBg`
- Dark mode: handled by CSS variables in `theme.css` — do not use Tailwind `dark:` variants

### Accessibility (non-negotiable)
- Decorative icons: `aria-hidden="true"` always
- Icon-only buttons: `aria-label` always
- All inputs: `<label>` or `aria-label` always
- Modals: `role="dialog"` + `aria-modal` + focus trap
- Page title: `document.title = t("page.title")` in every page component
- Dynamic content: wrap in `aria-live="polite"` region

---

## Service Layer Pattern

Every service follows this pattern:
```ts
import { USE_SUPABASE, supabase } from "@/backend/services/supabase";
import { mockData } from "./mock/...";

export async function getCaregivers(): Promise<Caregiver[]> {
  if (!USE_SUPABASE) return mockData.caregivers; // Always keep mock fallback

  const { data, error } = await supabase.from("caregivers").select("*");
  if (error) throw error;
  return data;
}
```

---

## Auth Pattern

```ts
import { useAuth } from "@/backend/store/auth/AuthContext";

const { user, logout } = useAuth();
const role = user?.activeRole; // type: Role
```

Do not check roles via URL segments — always use `user.activeRole` from auth context.

---

## Realtime Pattern

```ts
const channel = supabase.channel("caregivers")
  .on("postgres_changes", { event: "*", schema: "public", table: "caregivers" },
    (payload) => handleChange(payload)
  )
  .subscribe();

// Always clean up
return () => { supabase.removeChannel(channel); };
```

---

## Offline Pattern

```ts
import { useSyncQueue } from "@/backend/offline/useSyncQueue";
import { useOnlineStatus } from "@/backend/offline/useOnlineStatus";
import { db } from "@/backend/offline/db";

// Write optimistically to Dexie
await db.careNotes.put(note);

// Queue for sync if offline
const { enqueue } = useSyncQueue();
if (!isOnline) enqueue({ table: "care_notes", op: "upsert", payload: note });
```
