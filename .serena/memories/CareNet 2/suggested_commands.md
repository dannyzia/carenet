# CareNet 2 - Suggested Commands

## Development
```bash
# Install dependencies
npm i
# or
pnpm install

# Start development server (localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing
```bash
# Run Vitest unit tests
npm run test

# Run Vitest in watch mode
npm run test:watch

# Run Playwright end-to-end tests
npm run test:e2e
```

## i18n & Translation
```bash
# Extract translation keys and sync across all locales
npm run i18n:sync

# Preview i18n sync changes (dry run)
npm run i18n:sync:dry

# Translate missing keys (uses Google Translate API)
npm run translate

# Preview translation changes (dry run)
npm run translate:preview

# Verify translation coverage and consistency
npm run translate:verify

# Check translations for errors
npm run translate:check

# Strict translation check (fails on any issues)
npm run translate:check-strict
```

## AI Context Sync
```bash
# Sync AI context memory with current codebase state
npm run ai:sync
```

## Capacitor / Native Builds
```bash
# Sync to native projects (Android/iOS)
npx cap sync

# Open Android project in Android Studio
npx cap open android

# Open iOS project in Xcode
npx cap open ios
```

## File Operations
```bash
# Windows (system)
dir                    # List directory
cd <directory>         # Change directory
mkdir <folder>          # Create folder
type <file>             # Read file (cat equivalent)
copy <source> <dest>   # Copy file
del <file>              # Delete file
move <source> <dest>   # Move/rename file

# Git (Windows Git Bash or PowerShell)
git status
git add .
git commit -m "message"
git push
git pull
git branch
git checkout
```

## Linting & Formatting (if configured)
```bash
# Note: No explicit linting scripts found in package.json
# If adding later, would typically be:
npm run lint
npm run format
npm run type-check
```

## Environment Variables
```bash
# Copy env example to create actual .env file
cp .env.example .env

# Edit .env file (Windows)
notepad .env
# or
code .env
```
