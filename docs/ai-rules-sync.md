# AI Rules And Skills Sync

This project's IDE rule files and skill folders are generated copies.

## Source Of Truth

Do not hand-edit the generated AI rule or skill files inside `CareNet 2`.

Edit the shared source pack here instead:

`C:\Users\callz\OneDrive\Documents\My Projects\SynologyDrive\Websites\Rules&Skills\packs\carenet-2`

## After Editing The Pack

From the `CareNet 2` project root, run:

```powershell
npm run ai:sync
```

## What Gets Regenerated

- `.cursor/rules/`
- `.cursor/skills/`
- `.github/copilot-instructions.md`
- `.rules`
- `rules.md`
- `.windsurfrules`
- `.kilocode/rules/tech-stack.md`
- `.kilocode/rules.md`
- `.kilocode/skills/`
- `.agents/rules/tech-stack.md`
- `.agents/skills/`
- `.agent/rules/tech-stack.md`

## Simple Workflow

1. Update the pack in `Rules&Skills`.
2. Run `npm run ai:sync` in `CareNet 2`.
3. Start a new IDE/agent session if needed so the updated rules are picked up.
