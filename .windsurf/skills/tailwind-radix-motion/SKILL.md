---
name: tailwind-radix-motion
description: CareNet 2 UI skill for Tailwind CSS v4, shared tokens, Radix-based components, MUI coexistence, and `motion/react` animations. Use when building or refactoring components, layouts, motion, or interaction design in this repo.
---

# UI Implementation

Read these files first:
- `src/styles/tailwind.css`
- `src/styles/theme.css`
- `src/frontend/theme/tokens.ts`
- `src/frontend/components/shared/`
- `src/frontend/components/ui/`

Follow these rules:
- Match the repo's Tailwind v4 setup and reuse existing spacing, card, badge, and shell patterns.
- Use tokenized colors and CSS variables instead of adding new color literals.
- Prefer shared components and Radix-based primitives before creating new widgets.
- Use MUI only where the existing screen already leans on it or the widget is clearly simpler there.
- Import motion helpers from `motion/react`.
- Preserve reduced-motion support, safe-area helpers, dark mode, and accessible labeling.

Avoid:
- new styling systems
- raw color literals for new UI
- a second animation library
