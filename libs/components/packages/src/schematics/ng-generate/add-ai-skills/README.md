# add-ai-skills schematic

Adds the `skyux-update-debugger` AI skill to a project's `.github/skills/` directory. The skill guides AI coding assistants through systematic root cause analysis when troubleshooting breaking changes after Angular or SKY UX updates.

## Usage

```bash
npx ng generate @skyux/packages:add-ai-skills
```

This copies `.github/skills/skyux-update-debugger/SKILL.md` into the workspace. Re-running the schematic overwrites the skill file with the latest version. Other user-owned files in `.github/skills/` are not affected.

## What the skill covers

- 4-phase debugging methodology (root cause investigation, pattern analysis, hypothesis testing, implementation)
- Migration-specific troubleshooting (standalone component errors, deprecated API removal, `inject()` context issues)
- Replacing `ng-mocks` with Angular-native testing patterns
- Migrating `Sky*Fixture` classes to `Sky*Harness` classes
- Common anti-patterns that break during upgrades (direct DOM queries, `setTimeout` in tests)

## Evals

`tests/evals.json` is a reference file containing conceptual prompts and expected responses that clarify what this skill is expected to do. Each entry has:

- **prompt** — a realistic user request that should trigger the skill
- **expected_output** — what a correct response looks like

This file is intended to be used as a reference when working with an AI agent to validate or refine the skill. It is not packaged to be run in any specific test framework.
