# CareNet 2 - Technology Stack

## Core Framework & Runtime
- **React 18.3.1** - Component library with hooks
- **TypeScript** - Static typing (tsconfig not present, uses Vite's TypeScript support)
- **Vite 6.3.5** - Build tool and dev server

## Routing & State Management
- **React Router 7.13.0** - Not react-router-dom (uses custom shim in `src/lib/react-router-shim.ts`)
- **No global state library** - Avoid Redux, Zustand, Jotai, TanStack Query by default
- **React Context** - Used for auth and theme (AuthContext, ThemeProvider)
- **LocalStorage/SessionStorage** - Session persistence via Supabase auth

## Styling & UI
- **Tailwind CSS v4.1.12** - Utility-first CSS, configured in `src/styles/tailwind.css`
- **CSS Variables** - Theme tokens in `src/styles/theme.css`, uses var() extensively
- **Radix UI** - Headless UI components (Accordion, Tabs, Dialog, Select, etc.)
- **Lucide React v0.487.0** - Icon library
- **Motion 12.23.24** - Animation library (Framer Motion replacement)
- **MUI Components** - Used where surfaces already lean on MUI (@mui/material v7.3.5)

## Backend & Database
- **Supabase** - PostgreSQL + Auth + Storage + Edge Functions
- **@supabase/supabase-js v2.99.2** - Client library
- **Row-Level Security (RLS)** - Database-level access control
- **Real-time subscriptions** - Supabase Channels for live updates
- **Mock data fallback** - Auto-switches to mock mode when env vars missing

## Offline & Sync
- **Dexie v4.3.0** - IndexedDB wrapper for offline storage
- **dexie-react-hooks v4.2.0** - React hooks for Dexie
- **Custom sync engine** - Queue-based offline write system, syncs on reconnect
- **USE_OFFLINE flag** - Controls offline mode testing

## Internationalization (i18n)
- **i18next v25.8.18** - i18n framework
- **react-i18next v16.5.8** - React bindings
- **Bilingual EN/BN** - English and Bangla (বাংলা)
- **40+ locales** - Supports runtime-loaded admin-managed languages
- **Vite plugin** - `vite-i18n-sync` for auto-propagation of translation keys
- **Bangla Script** - Google Translate API integration for BN translations

## Testing
- **Vitest v4.1.0** - Unit test runner (node environment by default)
- **Playwright v1.58.2** - E2E testing
- **Testing Library** - @testing-library/react v16.3.2
- **Coverage** - v8 provider for Vitest

## Data Visualization & Forms
- **Recharts v2.15.2** - Charting library
- **react-hook-form v7.55.0** - Form state management
- **react-dnd v16.0.1** - Drag and drop functionality

## Other Key Libraries
- **date-fns v3.6.0** - Date manipulation
- **sonner v2.0.3** - Toast notifications
- **cmdk v1.1.1** - Command palette
- **canvas-confetti v1.9.4** - Celebration effects
- **next-themes v0.4.6** - Theme management (dark mode)
- **react-day-picker v8.10.1** - Calendar component
- **react-resizable-panels v2.1.7** - Resizable panels
- **class-variance-authority v0.7.1** - Variant utilities
- **tailwind-merge v3.2.0** - Tailwind class merging
- **tw-animate-css v1.3.8** - Animation utilities

## Native / PWA
- **Capacitor** - Native iOS/Android builds
- **PWA-ready** - Service workers, offline capability
- **Safe area handling** - Notch, dynamic island support
- **Deep linking** - App URL opening handling

## Build System
- **pnpm** - Package manager
- **Vite 6.3.5** - Module bundler with HMR
- **TypeScript paths** - Alias @ -> ./src, react-router shim
- **PostCSS** - Configured but minimal (Tailwind handles most)
- **Output**: `dist/` directory
