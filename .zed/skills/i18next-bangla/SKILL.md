---
name: i18next-bangla
description: CareNet 2 localization skill for i18next, committed English and Bangla locale files, runtime language discovery, and translation scripts. Use when adding strings, editing locale JSON, changing language behavior, or improving localization in this repo.
---

# Localization Workflow

Read these files first:
- `src/frontend/i18n/index.ts`
- `src/frontend/i18n/languageManager.ts`
- `src/locales/en/`
- `src/locales/bn/`
- `scripts/translate.mjs`
- `scripts/sync-i18n-keys.mjs`

Follow these rules:
- Add committed strings to both `src/locales/en/` and `src/locales/bn/`.
- Keep user-facing text out of components when it belongs in translations.
- Reuse `useTranslation()` and the existing language helpers.
- Preserve the runtime-added language path; do not hardcode assumptions that only two languages can exist.
- Use the existing scripts for bulk key work or verification.

When adding new copy:
1. Add the English key in the right namespace.
2. Add the Bangla translation in the matching locale file.
3. Verify no duplicate or dead keys were introduced.
4. Check for role-specific, mobile, and validation text too.
