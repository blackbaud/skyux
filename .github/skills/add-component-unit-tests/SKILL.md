---
name: add-component-unit-tests
description: 'Workflow for writing or backfilling Karma + Jasmine unit tests for a component or directive that ships from a @skyux/* library in this Nx monorepo. Use when asked to "write unit tests", "add a spec", "test this component/directive", or raise coverage for library source under libs/components/<lib>/src/lib/**. Covers reading the public API, mirroring a sibling spec, the fixture/TestBed setup, accessibility tests, SKY custom matchers, coverage, and the test/lint/format gate. For code-example demo specs use the code-examples instruction; for test harnesses use the add-component-harness skill.'
argument-hint: '<library> <ComponentOrDirective> (e.g. forms SkyCheckbox)'
---

# Add Unit Tests for a Component or Directive

Use this skill to write or backfill the unit test (`<name>.component.spec.ts` or
`<name>.directive.spec.ts`) for a component or directive in a published
`@skyux/*` library. The detailed conventions live in
[component-unit-testing.instructions.md](../../instructions/component-unit-testing.instructions.md)
(it auto-applies to `**/libs/components/*/src/lib/**/*.{component,directive}.spec.ts`)
— read it before writing code rather than guessing.

Read [AGENTS.md](../../../AGENTS.md) first if you are not already familiar with
the monorepo's conventions (Nx tasks, the Karma vs. Jest split, coverage
thresholds, and Conventional Commits).

## When to Use

- A component or directive needs a new spec, or an existing spec needs to cover
  new inputs/outputs/branches.
- Raising a library's coverage back to its threshold.

Do NOT use this skill for:

- **Code-example demo specs** (`libs/components/code-examples/**`) — those follow
  [code-examples-unit-testing.instructions.md](../../instructions/code-examples-unit-testing.instructions.md).
- **Test harness specs** (`libs/components/**/testing/src/**`) — use the
  [add-component-harness](../add-component-harness/SKILL.md) skill.
- Jest-based projects (`libs/sdk/*`, `manifest`, `packages`) — those use a
  different runner and conventions.

## Procedure

Work top to bottom. **Always mirror an existing sibling spec** in the same
library for exact style; do not invent new patterns.

1. **Read the subject's public API.** Open the component/directive under
   `libs/components/<library>/src/lib/modules/<module>/`. Note every
   `input()`/`@Input()`, `output()`/`@Output()`, `model()`, public method, host
   bindings, template branches, and any rendered states that affect
   accessibility. The spec must exercise this surface and every branch.

2. **Pick a sibling spec to mirror** in the same library, and check whether a
   fixtures module/host component already exists
   (`fixtures/<name>.module.fixture.ts`). Reuse it; create a minimal host
   `TestComponent` only if none fits.

3. **Write the spec** following
   [component-unit-testing.instructions.md](../../instructions/component-unit-testing.instructions.md)
   for the TestBed/fixture setup, input-driving, SKY custom matchers, mocking,
   and async helpers. The spec must:
   - exercise every input/output, public method, and template branch;
   - include a `describe('a11y', ...)` block asserting
     `await expectAsync(fixture.nativeElement).toBeAccessible()` in each
     meaningful state;
   - reach the project's coverage threshold (usually **100%**).

4. **Verify.** Run the library's specs headless, then lint and format:

   ```bash
   npx nx test <library> --browsers=ChromeHeadless
   npm run lint:affected
   nx format --files=<changed-file-paths>
   ```

   Confirm the run reports the coverage thresholds as met.

5. **Commit.** Use a Conventional Commit with the `components/<library>` scope
   per
   [commit-message.instructions.md](../../instructions/commit-message.instructions.md).

## Definition of Done

- The spec lives beside its subject and mirrors a sibling spec's structure.
- Every input/output, public method, branch, and error path is exercised, and
  an `a11y` block asserts accessibility in each meaningful state.
- `npx nx test <library>` passes at the project's coverage threshold, lint is
  clean, and changed files are formatted.
