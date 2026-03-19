# CareNet 2 AS Build Documentation

## Overview
This document outlines the automated build (AS) process for the CareNet 2 project, including build configuration, deployment procedures, and version control practices.

## Build Configuration

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Package Manager**: npm
- **Version Control**: Git

### Build Commands
```bash
# Development build
npm run build:dev

# Production build
npm run build

# Build with source maps (for debugging)
npm run build:sourcemap

# Build for specific environments
npm run build:staging
npm run build:production
```

### Build Artifacts
The build process generates the following artifacts in `dist/`:
- `index.html` - Main HTML entry point
- `assets/` - Bundled JavaScript and CSS files
- `manifest.json` - PWA manifest
- `sw.js` - Service worker for offline functionality

## Pre-Build Requirements

### Environment Variables
Ensure the following environment variables are set before building:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_APP_VERSION` - Application version (follows semantic versioning)
- `VITE_BUILD_DATE` - Build timestamp
- `VITE_BUILD_ENV` - Build environment (dev/staging/production)

### Dependency Installation
```bash
npm ci  # Clean install for production builds
npm install  # Standard install for development
```

## Version Control Integration

### Git Hooks
Pre-commit hooks are configured to:
1. Run TypeScript type checking
2. Execute ESLint validation
3. Run tests (if applicable)
4. Generate build artifact checksums

### Version Tagging
Every production build should be tagged:
```bash
git tag -a v2.x.x -m "Release version 2.x.x"
git push origin v2.x.x
```

### Build Metadata
Each build includes embedded metadata:
- Git commit hash
- Build timestamp
- Branch name
- Version number
- Build environment

## Build Process Steps

### 1. Clean Build
```bash
# Remove previous build artifacts
rm -rf dist/
# Clear npm cache if needed
npm cache clean --force
```

### 2. TypeScript Compilation
```bash
# Type checking
npx tsc --noEmit
# Check for circular dependencies
npx madge --circular src/
```

### 3. Asset Optimization
- Images: Compressed and optimized using `vite-plugin-imagemin`
- Fonts: Subsetted and optimized
- CSS: Minified with Tailwind CSS purging
- JavaScript: Minified with tree-shaking

### 4. Bundle Analysis
```bash
# Generate bundle analyzer report
npm run build:analyze
```
Review bundle size and dependencies post-build.

## Deployment Procedures

### Staging Deployment
1. Run production build: `npm run build:staging`
2. Upload artifacts to staging environment
3. Verify functionality with automated tests
4. Run manual QA checklist

### Production Deployment
1. Create release branch: `git checkout -b release/v2.x.x`
2. Update version numbers in package.json
3. Create changelog entry
4. Build for production: `npm run build:production`
5. Validate build locally
6. Create pull request to main
7. After approval, merge and tag release
8. Deploy to production environment

## Post-Build Validation

### Automated Checks
- Vite build validation
- Bundle size limits (<2MB primary chunk)
- Broken link checking
- Accessibility audit
- Performance metrics validation

### Manual Verification
- Login functionality
- Offline mode functionality
- Real-time data sync
- Role-based permissions
- Mobile responsiveness

## Rollback Procedures

### Immediate Rollback
If critical issues are discovered post-deployment:
1. Revert to previous version using git rollback
2. Redeploy previous build artifact
3. Notify team and document issues

### Hotfix Process
For critical fixes:
1. Create hotfix branch from release tag
2. Apply minimal changes
3. Test thoroughly
4. Deploy as patch version
5. Merge back to main

## Build Environment Specifics

### Development Build
- Source maps enabled
- Hot module replacement active
- Development API endpoints
- Verbose error messages
- Unminified code for debugging

### Staging Build
- Production-like configuration
- Reduced source maps
- Staging API endpoints
- Error tracking enabled
- Performance profiling active

### Production Build
- Full optimization enabled
- Minimal source maps
- Production API endpoints
- Error boundaries active
- Analytics and monitoring enabled

## Security Considerations

### Build Security
- Dependencies vulnerability scanning
- No secrets in build artifacts
- Environment variable validation
- Content Security Policy headers
- Subresource integrity checks

### Artifact Signing
- Build artifacts are cryptographically signed
- Checksums generated for integrity verification
- Digital certificates used for production builds

## Monitoring and Alerts

### Build Notifications
- Failed builds trigger Slack notifications
- Successful deployments logged to monitoring system
- Bundle size warnings when limits exceeded
- Performance regression alerts

### Metrics Tracked
- Build duration
- Bundle size by component
- Build success rate
- Deployment frequency
- Rollback frequency

## Troubleshooting

### Common Build Issues
1. **Memory errors**: Increase Node.js heap size
2. **Type errors**: Check TypeScript configuration
3. **Import errors**: Verify module resolution paths
4. **Build timeouts**: Check for circular dependencies

### Debug Commands
```bash
# Verbose build output
npm run build -- --debug

# Build with detailed timing
npm run build -- --profile

# Check for duplicate dependencies
npm ls --depth=0
```

## Maintenance Schedule

### Regular Updates
- Monthly dependency updates
- Quarterly build tool updates
- Annual security audit
- Bi-annual performance optimization review

### Documentation Updates
This document should be updated:
- When build tools are upgraded
- When new environments are added
- When deployment processes change
- Following major releases

## Contact Information

For build-related issues or questions:
- **Primary Maintainer**: Development Team
- **Backup**: DevOps Team
- **Emergency**: On-call Engineer

## Appendix

### Build Configuration Files
- `vite.config.ts` - Main build configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Dependencies and scripts
- `.env.production` - Production environment variables

### Useful Build Scripts
```bash
# Generate build report
npm run build:report

# Clean and rebuild
npm run rebuild

# Build specific components
npm run build:component -- --name=ComponentName

# Check build compatibility
npm run build:compat
```
