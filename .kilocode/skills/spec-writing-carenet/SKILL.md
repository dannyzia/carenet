---
name: spec-writing-carenet
description: CareNet 2 planning skill for writing feature briefs, implementation specs, and agent-ready plans that match this repo's routing, offline, i18n, mobile, and testing constraints. Use when planning a feature or preparing work for another agent in this project.
---

# Spec Writing For CareNet 2

Write specs around observable behavior, then anchor them to CareNet 2 constraints.

## Include
- Goal and user-visible outcome
- Affected route, screen, or flow
- Auth or role assumptions
- Offline and realtime expectations
- Localization impact for `en` and `bn`
- Mobile or Capacitor impact
- Required Vitest and Playwright coverage

## Prefer
- References to existing files and patterns in this repo
- Explicit "must not break" notes for mock mode, native flows, and translation coverage
- Acceptance criteria that can be verified in browser and hybrid contexts
