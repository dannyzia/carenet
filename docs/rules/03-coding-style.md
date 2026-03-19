# CareNet 2 — Coding Style & Quality Rules

## TypeScript
- Strict mode is ON — no implicit `any`
- If `any` is truly needed, add `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with a comment explaining why
- Prefer `type` over `interface` for object shapes (use `interface` only for classes/extensible contracts)
- Always type custom hook return values as explicit tuples or named objects — not inferred
- Use `satisfies` operator for config objects to get type-checking without widening
- Never use non-null assertion `!` without a comment

## React
- Functional components only — no class components
- Keep components under ~200 lines; extract sub-components or hooks if larger
- Never put business logic directly in JSX — extract to handlers or hooks
- `useEffect` dependencies must be exhaustive — no suppression comments
- Memoisation (`useMemo`, `useCallback`, `React.memo`) only when there is a measured perf reason — not by default
- Prefer `Suspense` boundaries + lazy loading via the `p()` helper in routes.ts — not manual loading states

## Naming Conventions
| Thing | Convention | Example |
|---|---|---|
| Component | PascalCase | `CaregiverDashboardPage` |
| Hook | camelCase + `use` prefix | `useUnreadCounts` |
| Service function | camelCase verb-noun | `getCaregivers`, `updateShift` |
| Event handler | camelCase `handle` prefix | `handleSubmit`, `handleRowClick` |
| Boolean variable | `is/has/can/should` prefix | `isLoading`, `hasError`, `canEdit` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Type/interface | PascalCase | `CaregiverProfile`, `ShiftStatus` |
| i18n key | camelCase dot-path | `sidebar.caregivers`, `page.title` |
| CSS variable | kebab-case | `--role-caregiver`, `--bg-page` |

## Imports Order (enforced)
```ts
// 1. React & React ecosystem
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

// 2. Third-party libraries
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

// 3. Internal — backend
import { useAuth } from "@/backend/store/auth/AuthContext";
import { getCaregivers } from "@/backend/services/caregiver.service";

// 4. Internal — frontend components
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
import { cn, roleConfig } from "@/frontend/theme/tokens";

// 5. Types (import type)
import type { Caregiver } from "@/backend/models/caregiver.model";
```

## Error Handling
- Every `async` function must have try/catch or `.catch()`
- Supabase calls: always destructure `{ data, error }` and check `if (error) throw error`
- User-facing errors: use Sonner toast — `toast.error(t("errors.generic"))`
- Never `console.error` in production code — use proper error boundaries

## Do Not
- ❌ Hardcode any user-facing string — always `t("key")`
- ❌ Hardcode colour hex values — always use `cn.*` or CSS variables
- ❌ Import from `src/frontend/components/[filename]` root duplicates — use `shared/` or `mobile/` subdirectories
- ❌ Use `window.location` for navigation — always use React Router's `useNavigate` or `useTransitionNavigate`
- ❌ Direct DOM manipulation — always React state/refs
- ❌ Inline styles for colours not in the `cn` object
- ❌ Skip the mock fallback in service files
- ❌ Create new top-level folders in `src/` without discussing first

## Do Always
- ✅ Add `document.title = t("page.title")` at the top of every page component
- ✅ Add `aria-label` to every icon-only button and link
- ✅ Add `aria-hidden="true"` to every decorative Lucide icon
- ✅ Write i18n keys for both `en` and `bn` locales simultaneously
- ✅ Run `pnpm build` mentally — ensure no TypeScript errors before finishing
- ✅ Add a Vitest test for every new hook or utility function
- ✅ Add a Playwright e2e test for every new user-facing flow
