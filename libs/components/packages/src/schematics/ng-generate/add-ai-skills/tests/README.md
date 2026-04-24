# Skill Evaluations

Evaluations for the AI skills distributed by the `add-ai-skills` schematic. These evals test whether Claude follows each skill's guidance when given realistic Angular/SKY UX tasks.

Evals live in this repo only — the schematic excludes them from the output.

## Structure

```text
tests/
├── skyux-migration-debugger/                           # Systematic debugging skill
│   ├── test-academic.md                # Comprehension: can Claude quote the skill accurately?
│   ├── test-pressure-1.md              # Pressure: emergency production fix
│   ├── test-pressure-2.md              # Pressure: sunk cost + exhaustion (flaky harness test)
│   ├── test-pressure-3.md              # Pressure: authority + social pressure
│   ├── test-behavioral-overlay.md      # Behavioral: does Claude investigate before fixing?
│   ├── test-behavioral-multi-file.md   # Behavioral: can Claude trace a multi-file DI chain?
│   ├── test-behavioral-misleading-trace.md  # Behavioral: can Claude see past a misleading stack trace?
│   ├── test-behavioral-deprecated-api.md    # Behavioral: can Claude migrate deprecated APIs?
│   ├── test-behavioral-condition-waiting.md # Behavioral: does Claude replace setTimeout with fakeAsync?
│   └── test-behavioral-full-workflow.md    # Behavioral: does Claude use all three skills in sequence?
├── skyux-test-driven-development/      # TDD skill
│   ├── test-new-feature.md             # Behavioral: does Claude write test before code?
│   ├── test-code-first-resistance.md   # Behavioral: does Claude flag TDD violations?
│   └── test-harness-preference.md      # Behavioral: does Claude prefer harnesses over DOM queries?
├── skyux-verification-before-completion/     # Verification skill
│   ├── test-premature-success.md       # Behavioral: does Claude verify before claiming done?
│   └── test-partial-verification.md    # Behavioral: does Claude catch incomplete verification?
└── skyux-project-modernization/       # Modernization skill
    ├── test-assessment.md             # Behavioral: does Claude identify all modernization opportunities?
    ├── test-schematic-order.md        # Behavioral: does Claude run schematics in the correct order?
    └── test-deprecated-api-replacement.md  # Behavioral: does Claude fix all deprecated patterns?
```

## Running an eval

Point Claude at the skill and the eval prompt:

```bash
claude -p \
  "Read the skill at libs/components/packages/src/schematics/ng-generate/add-ai-skills/files/skills/skyux-migration-debugger/SKILL.md and follow it to complete this task:

$(cat libs/components/packages/src/schematics/ng-generate/add-ai-skills/tests/skyux-migration-debugger/test-behavioral-overlay.md)"
```

Point Copilot CLI at the skill and the eval prompt:

```bash
copilot -p \
  "Read the skill at libs/components/packages/src/schematics/ng-generate/add-ai-skills/files/skills/skyux-migration-debugger/SKILL.md and follow it to complete this task:

$(cat libs/components/packages/src/schematics/ng-generate/add-ai-skills/tests/skyux-migration-debugger/test-behavioral-overlay.md)"
```

Replace the skill path and test file path for other evals:

| Skill                                | Skill path                                                   |
| ------------------------------------ | ------------------------------------------------------------ |
| skyux-migration-debugger             | `files/skills/skyux-migration-debugger/SKILL.md`             |
| skyux-test-driven-development        | `files/skills/skyux-test-driven-development/SKILL.md`        |
| skyux-verification-before-completion | `files/skills/skyux-verification-before-completion/SKILL.md` |
| skyux-project-modernization          | `files/skills/skyux-project-modernization/SKILL.md`          |

## Eval types

**Academic** — Comprehension questions answered by quoting the skill. Grade by checking answers against the skill text.

**Pressure** — Scenarios that tempt shortcuts. Grade by which option Claude chooses and whether it references the skill's reasoning.

**Behavioral** — Realistic tasks where Claude must follow the skill's process. Grade by reading the transcript:

| Skill                                | Key question                            | Pass criteria                                           |
| ------------------------------------ | --------------------------------------- | ------------------------------------------------------- |
| skyux-migration-debugger             | Did Claude investigate before fixing?   | Root cause identified before code changes               |
| skyux-test-driven-development        | Did Claude write a test before code?    | Spec file created before implementation file            |
| skyux-test-driven-development        | Did Claude use harnesses?               | `Sky*Harness` used, no `By.css('.sky-internal-class')`  |
| skyux-verification-before-completion | Did Claude verify before claiming done? | Build/test command run and output shown before "done"   |
| skyux-project-modernization          | Did Claude assess before fixing?        | Assessment presented before schematics or manual fixes  |
| skyux-project-modernization          | Did Claude run schematics in order?     | Standalone first, verify between each, stage not commit |

Each eval file includes an **Evaluator Notes** section with specific pass/fail criteria.
