---
applyTo: '**/libs/components/code-examples/**, **/libs/components/*/documentation.json'
description: 'SKY UX instructions for authoring code example components and their unit tests.'
---

# SKY UX Instructions: Component Code Examples

## Overview

Code examples are runnable demos published from `@skyux/code-examples` and
rendered in the docs and StackBlitz. Each example is a small standalone
component paired with a unit test that shows consumers how to test a feature
like it with the component's test harness.

This file covers both **authoring the example component** and **writing its
spec**. Open a sibling example only to look up facts (which module to import,
the route/docs wiring) — take the facts, not the structure, since some older
examples predate these conventions.

## Authoring the example component

### Location and files

- **Base path**: `libs/components/code-examples/src/lib/modules/<library>/<component>/<example-name>/`
- **Files**: `example.ts`, `example.html`, and `example.spec.ts` (following
  Angular's revised naming guidelines — no `.component.` segment). Add
  `example.service.ts` or other files only when the example needs them. Always
  use the `example.*` prefix — never `demo.*`. Many older examples still use the
  legacy `example.component.*` filenames; match the new naming for new work
  rather than copying the old files.

### Component conventions

- **Class name**: `<Library><Component><ExampleName>Example` (e.g.
  `FormsInputBoxBasicExample`, `ListsRepeaterInlineFormExample`,
  `LayoutActionBarsModalExample`) — following Angular's revised naming
  guidelines, the `Component` suffix is dropped. When a library has a single
  example the segments may collapse (e.g. `avatar/avatar/` → `AvatarExample`).
  Older examples still carry the legacy `...ExampleComponent` suffix; neither
  the suffix nor the `.component.` filename is required by the docs pipeline,
  which discovers examples by their barrel export, `selector`, and `@title`.
- The component is **standalone** (do not add `standalone: true`; it is the
  default) and imports the SKY UX module(s) it demonstrates.
- Add a `/** @title ... */` JSDoc above the class describing the example — the
  docs pipeline reads it.
- Follow Angular best practices in
  [angular.instructions.md](./angular.instructions.md).
- Keep the example a clear, realistic showcase of the component's public API;
  it is consumer-facing documentation.

### Wiring (easy to forget)

- Export the example class from `libs/components/code-examples/src/index.ts`.
- The route registry at `libs/components/code-examples/routes/src/index.ts` is
  **auto-generated** from that barrel — never hand-edit it; regenerate with
  `npx nx run code-examples:prebuild`.
- Add the example class name to the **owning library's** `documentation.json`
  (`libs/components/<library>/documentation.json`) under
  `groups.<library>.codeExamples.docsIds`. The `code-examples` project itself
  has no `documentation.json`.

## Writing the spec

## Test Content Requirements

### Purpose

Write the tests a consumer would write for a feature like this example, and
use them to show off the harness. Consumers copy these specs into their own
apps, so every test should verify the **example's behavior** — what the user
sees and what happens when they interact — not the harness's.

- **Do**: "should show the details of the clicked bar" — find the bar with the
  harness, click it, and assert the example's output.
- **Don't**: "should get a data point for each bar" or "should filter data
  points by category" — these test the harness, which its own spec already
  covers.

### Test Structure

1. **Setup function**: Define a `setupTest()` helper that creates the fixture
   and returns the harness loader (and any harnesses the test needs)
2. **Initial state**: What the user sees before interacting
3. **User scenarios**: One test per realistic interaction and its outcome
4. **Feature-specific tests**: Group related scenarios in `describe` blocks when appropriate

### Harness Coverage

Show as much of the harness as the example gives a natural reason to use. Each
harness method should appear because the scenario needs it, not to tick it off.

- Locate harnesses the way a consumer would, e.g. `dataSkyId` filtering
  (inherited from `SkyHarnessFilters`) or component-specific filters such as
  `text` or `category`, via `HarnessName.with(filters)` or a parent harness's
  getter
- Drive **interactions** (clicks, form entry, state changes) through the
  harness and assert their effect on the example
- Use harness getters to assert state the example is responsible for, not to
  re-read the values you just filtered by
- Use **sub-harnesses** (context menus, forms, buttons, etc.) when the
  scenario reaches them
- Include **error scenarios** when the example handles them (e.g. validation)

## Code Quality Standards

### Dependencies

- Import test harnesses from appropriate testing modules
- Use `provideNoopSkyAnimations()` from `@skyux/core` to suppress animations
- Follow Angular testing best practices

### Test Patterns

- Use `async/await` for harness operations
- Use `expectAsync().toBeResolvedTo()` for async assertions
- Use `fixture.detectChanges()` and `fixture.whenStable()` after UI interactions
- Group related tests in `describe` blocks for organization

### Examples to Reference

- To learn what a harness can do, read its own spec (e.g.
  `libs/components/lists/testing/src/modules/repeater/repeater-harness.spec.ts`).
  Do not copy its method-by-method tests into a code-example spec.

## Documentation Integration

- Keep examples in sync with component and harness changes.
- Ensure tests reflect current harness capabilities.

## Development Workflow

- **Running tests**: `npx nx test code-examples --configuration=ci --include="[relative path to file]"`
- **Linting**: `npx nx lint code-examples` to check for lint errors, use `--fix` flag to automatically fix issues
- **Validation**: Ensure all tests pass and verify the example's behavior
- **Maintenance**: Update tests when harnesses or components change

## Key Principles

1. **Real-world tests**: test what the example does, as a consumer would
2. **Harness in context**: show the harness's capabilities through those tests
3. **Consumer-focused** examples that teach proper usage
4. **Maintainable** test structure that's easy to understand and update
