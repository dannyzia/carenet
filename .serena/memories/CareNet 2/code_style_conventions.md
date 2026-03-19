# CareNet 2 - Code Style & Conventions

## Naming Conventions

### Files & Directories
- **Kebab-case for files**: `useDocumentTitle.ts`, `agency.service.ts`, `routes.ts`
- **PascalCase for components**: `AgencyIncidentsPage.tsx`, `ProtectedRoute.tsx`, `PageSkeleton.tsx`
- **lowercase for utilities**: `cn.ts` (though file is named `tokens.ts`), `dedup.ts`, `retry.ts`
- **Kebab-case for directories**: `caregiver/`, `guardian/`, `frontend/`, `backend/`

### Variables & Constants
- **camelCase for variables**: `const severityConfig`, `const statusConfig`
- **PascalCase for types/interfaces**: `type AgencyIncident`, `interface User`
- **SCREAMING_SNAKE_CASE for constants**: `USE_SUPABASE`, `READ_RETRY`, `WRITE_RETRY`

### Components
- **PascalCase for component names**: `function AgencyIncidentsPage()`, `function PageSkeleton()`
- **PascalCase for custom hooks**: `function useDocumentTitle()`, `function useAsyncData()`

### Functions & Methods
- **camelCase for function names**: `function getIncidents()`, `function resolveIncident()`
- **camelCase for local variables**: `const filtered`, `const counts`, `const isActive`

## TypeScript Conventions

### Type Annotations
- **Explicit types for exported functions**: `export function useDocumentTitle(title: string | undefined): void`
- **Inline types for simple cases**: `const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")`
- **Interface for complex objects**: `interface AgencyIncident { id: string; title: string; ... }`
- **Type aliases for unions**: `type StatusFilter = IncidentStatus | "all"`
- **Type literals**: `"open" | "in-review" | "resolved" | "escalated"`

### Type Imports
- **Named exports preferred**: `export function useDocumentTitle()`, `export { useDocumentTitle } from "./index"`
- **Type imports**: `import type { AgencyIncident, IncidentSeverity } from "@/backend/models"`
- **React component imports**: `import { useState } from "react"`
- **Named imports from libraries**: `import { Link } from "react-router"`

## React Patterns

### Functional Components Only
- **No class components**: All components are functional with hooks
- **Hooks for state**: `useState`, `useEffect`, `useCallback`, `useMemo`
- **Custom hooks**: `useAsyncData`, `useDocumentTitle`, `useAuth`, `useTheme`

### Props & JSX
- **Fragment**: Use `<>` or `<React.Fragment>` for grouping
- **Arrow functions for handlers**: `onClick={() => setStatusFilter("all")}`
- **Conditional rendering**: Use ternary operators or `&&` for short conditions

## Styling Conventions

### Tailwind CSS
- **Utility classes**: `className="px-4 py-2 rounded-lg"`
- **Design tokens**: Import from `@/frontend/theme/tokens`, use `cn.text`, `cn.pink`, etc.
- **CSS variables**: Use `var(--cn-gradient-caregiver)` for gradients
- **Responsive**: `md:py-24`, `sm:flex-row`, `grid-cols-1 md:grid-cols-3`
- **Color tokens**: Never use hardcoded hex in components, always use theme tokens
- **Dark mode**: Use CSS vars or inline `style={{ color: cn.text }}`

### Styling Object Pattern
- **Prefer className** for Tailwind: `className="finance-card"`
- **Use style object** for dynamic values: `style={{ background: tier.accentBg }}`
- **Mixing both**: `className="..." style={{ ... }}` is acceptable

### Icons (Lucide)
- **Import from lucide-react**: `import { Flag, Plus, Clock } from "lucide-react"`
- **Aria-hidden**: `aria-hidden="true"` on decorative icons
- **Size classes**: `w-5 h-5`, `w-4 h-4` for standard sizes

## i18n Conventions

### Translation Keys
- **Dot notation**: `t("pageTitles.caregiverDashboard")`, `t("sidebar.incidentsList")`
- **Fallback values**: `t("key", "Fallback text")` - second param is fallback
- **Structured keys**: `pageTitles.*`, `sidebar.*`, `status.*`, `severity.*`
- **Committed en/ first**: Add keys to `src/locales/en/common.json`
- **Auto-sync**: `npm run i18n:sync` propagates to all other locales

### Common Key Groups
- **pageTitles**: For useDocumentTitle hook calls
- **sidebar**: For navigation labels
- **status**: Status text (open, resolved, etc.)
- **severity**: Severity labels (critical, high, etc.)
- **forms**: Form labels and validation messages
- **errors**: Error messages

## Routing Conventions

### Route Structure
```tsx
{
  Component: ProtectedRoute,  // Auth guard for child routes
  children: [
    {
      Component: AuthenticatedLayout,  // Main layout
      children: [
        { path: "caregiver/dashboard", ...p(() => import(...)) },
        { path: "guardian/dashboard", ...p(() => import(...)) },
        // ... 130+ more routes
      ]
    }
  ]
}
```

### Navigation
- **useNavigate**: `const navigate = useNavigate()` for programmatic navigation
- **useTransitionNavigate**: `const navigate = useTransitionNavigate()` - wrapper that uses React.startTransition
- **Link component**: `<Link to="/path">` for anchor navigation

## Service & API Conventions

### Service Methods
```tsx
// Read operations with dedup + retry
export function getIncidents(): Promise<AgencyIncident[]> {
  return sbRead("incidents", () => sb().from("incidents").select("*"));
}

// Write operations with retry
export function resolveIncident(id: string, note: string): Promise<void> {
  return sbWrite(() => sb().from("incidents").update({ resolutionNote: note }).eq("id", id));
}
```

### Service Structure
- **Export service object**: `export const agencyService = { getIncidents, resolveIncident, ... }`
- **Helper functions at bottom**: `export const mapAgency = ...` at end of service file
- **Mock data**: `MOCK_AGENCY_INCIDENTS` for fallback when `!USE_SUPABASE`

### Error Handling
- **Async functions**: Return errors from Supabase, handle in UI with try/catch
- **Loading states**: `const { data, loading } = useAsyncData(...)`
- **Empty states**: Conditional rendering when `data.length === 0`

## Component Conventions

### Page Components
```tsx
export default function SomePage() {
  const { t } = useTranslation("common");  // i18n
  useDocumentTitle(t("pageTitles.somePage", "Fallback"));  // WCAG
  const { data, loading } = useAsyncData(() => someService.getData());  // Data fetching

  if (loading || !data) return <PageSkeleton />;  // Loading state

  return (
    <div className="space-y-6">
      {/* Page content */}
    </div>
  );
}
```

### Shared Components
- **PageSkeleton**: Loading skeleton with configurable cards
- **StatCard**: Reusable stat display component
- **EmptyState**: "No items found" display
- **ConfirmDialog**: Modal for confirmations

### Guard Components
- **ProtectedRoute**: Wraps authenticated routes, checks `isAuthenticated`
- **Redirects to `/auth/login`** if not authenticated

## File Organization

### Imports Order (standard pattern)
```tsx
// 1. React
import { useState, useEffect } from "react";
import { Link } from "react-router";

// 2. Third-party libraries
import { Flag, Plus } from "lucide-react";

// 3. Internal
import { useAsyncData, useDocumentTitle } from "@/frontend/hooks";
import { cn } from "@/frontend/theme/tokens";
import { agencyService } from "@/backend/services";
import type { AgencyIncident } from "@/backend/models";
import { useTranslation } from "react-i18next";

// 4. Local components
import { PageSkeleton } from "@/frontend/components/shared/PageSkeleton";
```

## Comment Style
- **Header comments**: Use ══ or ─── for section dividers
- **Function docs**: JSDoc-style for exported functions
- **Inline comments**: Concise, explain WHY not WHAT

## Accessibility (a11y) Requirements
- **useDocumentTitle**: MUST be called in every page component
- **ARIA labels**: Icon-only buttons need `aria-label`
- **Decorative icons**: Use `aria-hidden="true"`
- **Focus management**: Visible focus ring on all interactive elements
- **Keyboard navigation**: Ensure Tab, Enter, Escape work properly
- **Semantic HTML**: Use `<main>`, `<nav>`, `<aside>` with aria-label

## Git & Version Control
- **Commit messages**: Conventional commits (feat: , fix: , chore: , docs: )
- **Branch naming**: feature/xxx, bugfix/xxx, etc.
- **Never commit .env**: Environment files are in .gitignore

## File Headers
```tsx
/**
 * Component/Service/File Name
 * ───────────────────────
 * Brief description of what this file does
 *
 * @exports { exportedFunction1, exportedFunction2 }
 */
```

## Constants & Configurations
- **Configuration objects**: Use Records for type-safe config lookup
```tsx
const severityConfig: Record<IncidentSeverity, { label: string; color: string; bg: string }> = {
  critical: { label: "Critical", color: cn.red, bg: "rgba(239,68,68,0.1)" },
  // ...
};
```
- **Enum-like arrays**: For sequential values
```tsx
const statusTabs: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  // ...
];
```
