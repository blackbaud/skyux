---
applyTo: '**/libs/components/code-examples/**, **/libs/components/*/documentation.json'
description: 'SKY UX instructions for authoring code example components and their unit tests.'
---

# SKY UX Instructions: Component Code Examples

## Overview

Code examples are runnable demos published from `@skyux/code-examples` and
rendered in the docs and StackBlitz. Each example is a small standalone
component paired with a thorough unit test that doubles as documentation for
the component's test harness.

This file covers both **authoring the example component** and **writing its
spec**. Open a sibling example only to look up facts (which module to import,
the route/docs wiring) — take the facts, not the structure, since some older
examples predate these conventions.

## Authoring the example component

### Location and files

- **Base path**: `libs/components/code-examples/src/lib/modules/<library>/<component>/<example-name>/`
- **Files**: `example.component.ts`, `example.component.html`, and
  `example.component.spec.ts`. Add `example.service.ts` or other files only when
  the example needs them. Always use the `example.*` prefix — never `demo.*`.

### Component conventions

- **Class name**: `<Library><Component><ExampleName>ExampleComponent` (e.g.
  `FormsInputBoxBasicExampleComponent`,
  `ListsRepeaterInlineFormExampleComponent`,
  `LayoutActionBarsModalExampleComponent`). When a library has a single example
  the segments may collapse (e.g. `avatar/avatar/` → `AvatarExampleComponent`).
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

These tests should be **thorough showcases** of test harness capabilities, not just basic smoke tests. They serve as:

- Documentation for consumers
- Examples of harness usage patterns
- Validation that harnesses work correctly

### Test Structure

1. **Setup function**: Define a `setupTest()` helper that creates the fixture
   and returns the harness loader (and any harnesses the test needs)
2. **Basic tests**: Component creation, rendering, data verification
3. **Harness demonstrations**: Show all relevant harness methods and capabilities
4. **Feature-specific tests**: Group related functionality in `describe` blocks when appropriate

### Harness Coverage

- Demonstrate **all public methods** of relevant harnesses
- Show **filtering capabilities** using the harness filter interfaces:
  - Test `dataSkyId` filtering (inherited from `SkyHarnessFilters`)
  - Test component-specific filter properties (e.g., `buttonType`, `text`, `styleType`)
  - Use `HarnessName.with(filters)` to demonstrate predicate filtering
- Include **error scenarios** where appropriate
- Test **interactions** (clicks, form submissions, state changes)
- Showcase **sub-harness access** (context menus, forms, buttons, etc.)

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

- For a thorough demonstration of exercising a harness's methods and filters,
  `libs/components/lists/testing/src/modules/repeater/repeater-harness.spec.ts`
  is a known-good reference. Learn the harness-usage approach from it; do not
  copy its structure or unrelated content into a code-example spec.

## Documentation Integration

- Keep examples in sync with component and harness changes.
- Ensure tests reflect current harness capabilities.

## Development Workflow

- **Running tests**: `npx nx test code-examples --configuration=ci --include="[relative path to file]"`
- **Linting**: `npx nx lint code-examples` to check for lint errors, use `--fix` flag to automatically fix issues
- **Validation**: Ensure all tests pass and demonstrate expected harness behavior
- **Maintenance**: Update tests when harnesses or components change

## Key Principles

1. **Comprehensive coverage** over minimal tests
2. **Clear demonstrations** of harness capabilities
3. **Consumer-focused** examples that teach proper usage
4. **Maintainable** test structure that's easy to understand and update
