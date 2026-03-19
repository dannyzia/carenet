# CareNet 2 - Project Structure

## Root Directory
```
CareNet 2/
├── .agent/                  # Agent-specific files
├── .agents/                 # Multi-agent context files
├── .cursor/                 # Cursor IDE rules
├── .github/                 # GitHub workflows, issues, PRs
├── .kilocode/              # Kilocode AI rules
├── .serena/                # Serena AI context
├── .windsurf/              # Windsurf IDE rules
├── .zed/                   # Zed IDE rules & skills
├── docs/                    # Documentation
├── e2e/                     # Playwright E2E tests
├── guidelines/               # Development guidelines
├── plugins/                 # Vite plugins (i18n sync)
├── scripts/                 # Build/translation/utility scripts
├── seed/                    # Supabase seed SQL files
├── src/                     # Main source code
├── supabase/               # Supabase Edge Functions, migrations
└── workflows/                # Workflow definitions

Configuration files:
- package.json              # Dependencies, scripts
- vite.config.ts           # Vite build config
- vitest.config.ts         # Vitest test config
- playwright.config.ts      # Playwright E2E config
- postcss.config.mjs       # PostCSS config
- capacitor.config.ts       # Capacitor native config
- .rules                   # Project rules (AI-generated)
- rules.md                 # Markdown rules reference
- .env.example             # Environment variables template
- tsconfig.json            # MISSING - should be added
```

## Source Code (src/)
```
src/
├── app/                    # Application wiring
│   ├── routes.ts            # React Router route definitions
│   └── App.tsx              # Root component, context providers
│
├── backend/                 # Backend services & models
│   ├── services/
│   │   ├── _sb.ts            # Supabase query helpers (sbRead, sbWrite, sb)
│   │   ├── supabase.ts        # Supabase client factory, USE_SUPABASE flag
│   │   ├── agency.service.ts   # Agency domain operations
│   │   ├── caregiver.service.ts # Caregiver domain operations
│   │   ├── guardian.service.ts  # Guardian domain operations
│   │   ├── admin.service.ts     # Admin domain operations
│   │   ├── patient.service.ts   # Patient domain operations
│   │   ├── moderator.service.ts # Moderator domain operations
│   │   ├── shop.service.ts      # Shop domain operations
│   │   ├── billing.service.ts   # Billing domain operations
│   │   ├── walletService.ts     # Wallet domain operations
│   │   ├── notification.service.ts # Notifications
│   │   ├── message.service.ts   # Messages
│   │   ├── realtime.ts         # Realtime subscriptions
│   │   ├── upload.service.ts    # File uploads
│   │   ├── backup.service.ts    # Backup operations
│   │   ├── contractService.ts  # Contracts
│   │   ├── community.service.ts # Community features
│   │   ├── search.service.ts    # Search functionality
│   │   ├── schedule.service.ts  # Scheduling
│   │   └── index.ts           # Service barrel exports
│   │
│   ├── models/
│   │   ├── agency.model.ts    # Agency interfaces (IncidentSeverity, etc.)
│   │   └── ...              # Other domain models
│   │
│   ├── store/
│   │   └── auth/             # Auth store & context
│   │       ├── AuthContext.tsx  # Auth provider, session management
│   │       └── ...
│   │
│   └── utils/              # Backend utilities
│       ├── retry.ts           # Retry logic (withRetry)
│       └── dedup.ts          # Deduplication utilities
│
├── frontend/                # Frontend code
│   ├── pages/               # Page components (168 pages across 7 roles)
│   │   ├── caregiver/         # 25+ caregiver pages
│   │   ├── guardian/           # 27+ guardian pages
│   │   ├── agency/             # 29+ agency pages
│   │   ├── admin/              # 18+ admin pages
│   │   ├── patient/            # 10+ patient pages
│   │   ├── moderator/          # 8+ moderator pages
│   │   ├── shop/               # Shop pages
│   │   ├── shop-front/          # Shop public pages
│   │   ├── public/             # Public pages (home, features, pricing)
│   │   ├── auth/               # Auth pages (login, register, etc.)
│   │   ├── shared/             # Shared pages (settings, notifications, messages)
│   │   ├── community/          # Community pages
│   │   ├── support/            # Support pages
│   │   ├── contracts/          # Contract pages
│   │   ├── billing/            # Billing pages
│   │   ├── wallet/             # Wallet pages
│   │   └── dev/                # Dev pages
│   │
│   ├── components/          # Reusable UI components
│   │   ├── guards/            # Auth guards (ProtectedRoute)
│   │   ├── shared/            # Shared components (PageSkeleton, etc.)
│   │   ├── shell/              # Layout components (AuthenticatedLayout, etc.)
│   │   ├── ui/                # Radix UI wrappers
│   │   └── native/            # Capacitor native helpers
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── index.ts           # Barrel export
│   │   ├── useAsyncData.ts    # Async data fetching hook
│   │   ├── useDebouncedSearch.ts
│   │   ├── useFormDraft.ts
│   │   ├── useBillingNotifications.ts
│   │   ├── usePendingProofCount.ts
│   │   ├── useNotificationPreferencesSync.ts
│   │   ├── useFileUpload.ts
│   │   ├── useAriaToast.ts
│   │   ├── useUnreadCounts.ts
│   │   ├── UnreadCountsContext.ts
│   │   └── useDocumentTitle.ts  # Document title hook (WCAG 2.4.2)
│   │
│   ├── theme/               # Design system
│   │   ├── tokens.ts          # Theme tokens (cn object, roleConfig)
│   │   └── tokens.css         # CSS variables for themes
│   │
│   ├── i18n/                # i18n bootstrap
│   │   └── i18n.ts          # i18next configuration
│   │
│   ├── auth/                # Auth wiring
│   │   └── AuthContext.tsx  # Auth provider implementation
│   │
│   ├── utils/               # Frontend utilities
│   │   └── ...
│   │
│   ├── data/                # Mock data
│   │   └── ...
│   │
│   ├── offline/              # Offline storage (Dexie)
│   │   └── ...
│   │
│   └── services/            # Frontend services (if any)
│
├── styles/                 # Global styles
│   ├── tailwind.css        # Tailwind v4 configuration
│   └── theme.css           # CSS variables, dark mode
│
└── lib/                   # Core utilities
    └── react-router-shim.ts  # Router shim (wraps useNavigate in startTransition)
```

## Frontend Pages Distribution
```
caregiver/      - 25+ pages (Dashboard, Jobs, Schedule, Care Log, Earnings, etc.)
guardian/        - 27+ pages (Dashboard, Patients, Schedule, Payments, Requirements, etc.)
agency/          - 29+ pages (Dashboard, Requirements Inbox, Job Management, Shift Monitoring, etc.)
admin/           - 18+ pages (Dashboard, Users, Verifications, Payments, Reports, etc.)
patient/          - 10+ pages (Dashboard, Vitals, Medications, Emergency, etc.)
moderator/       - 8+ pages (Dashboard, Reviews, Reports, etc.)
shop/            - Shop pages
shop-front/      - Public shop pages
public/          - 3 pages (Home, Features, Pricing)
auth/            - Auth pages (Login, Register, Role Selection, etc.)
shared/          - Shared pages (Settings, Notifications, Messages)
community/       - Community pages
support/          - Support pages
contracts/        - Contract pages
billing/          - Billing pages
wallet/           - Wallet pages
dev/              - Dev pages
```

## Supabase (backend/)
```
supabase/
├── functions/             # Edge Functions (Supabase)
│   └── ...              # Serverless functions
└── migrations/            # Database migrations
    └── ...              # SQL migration files
```

## Translations
```
src/locales/
├── en/                   # English translations
│   └── common.json      # All translation keys (pageTitles, sidebar, etc.)
└── bn/                   # Bangla translations (বাংলা)
    └── common.json      # Auto-synced from en/
```

## Key Files & Their Purpose
- `src/app/routes.ts` - Route definitions, ProtectedRoute wiring, all page paths
- `src/app/App.tsx` - Root component, providers setup
- `src/backend/services/supabase.ts` - Supabase client factory, USE_SUPABASE flag
- `src/backend/services/_sb.ts` - Supabase query helpers (sbRead, sbWrite, etc.)
- `src/frontend/hooks/useDocumentTitle.ts` - Document title hook for WCAG
- `src/frontend/theme/tokens.ts` - Design tokens, color system, role configs
- `vite.config.ts` - Build configuration, aliases, plugins
- `.env.example` - Environment variables template (to be created)
```

## Role-Based Color System
```
roleConfig in tokens.ts defines accent colors:
- guardian:    #72C98 (pink)
- caregiver:   #F0A2B7 (pink)
- agency:      #00897B (teal)
- admin:       #EF4444 (red)
- patient:      #4ADE80 (blue)
- moderator:    #8B5CF6 (orange)
- shop:        #F59E0B (orange)
```

## Offline Architecture
```
src/frontend/offline/:
- Dexie schema definition
- Offline queue management
- Sync engine (writes queue, flushes on reconnect)
```

## Testing Configuration
```
vitest.config.ts:
- Environment: node (default), jsdom for DOM tests
- Test location: src/**/__tests__/**/*.test.ts[x]
- Timeout: 10s per test
- Coverage: v8 provider

playwright.config.ts:
- E2E test configuration
- Browsers: Chromium, Firefox, WebKit
- Tests location: e2e/
```
