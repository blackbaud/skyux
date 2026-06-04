---
applyTo: '**/libs/components/code-examples/**|**/libs/components/*/src/**|**/libs/components/*/documentation.json'
description: 'SKY UX Copilot instructions for generating code example unit tests.'
---

# SKY UX Copilot Instructions: Code Example Unit Tests

## Overview

Create comprehensive unit tests for every code example component that showcase the capabilities of SKY UX test harnesses. These tests serve as documentation for consumers on how to use the harnesses effectively.

## File Structure and Naming

### Location

- **Base path**: `libs/components/code-examples/src/lib/modules/[library]/[component]/[example-name]/`
- **File name**: `example.component.spec.ts` (NOT `demo.component.spec.ts`)

### Component Naming Pattern

- **Pattern**: `[Library][Component][ExampleName]ExampleComponent`
- **Examples**:
  - `ListsRepeaterInlineFormExampleComponent`
  - `FormsInputBoxBasicExampleComponent`
  - `ActionBarsSummaryActionBarModalExampleComponent`

## Test Content Requirements

### Purpose

These tests should be **thorough showcases** of test harness capabilities, not just basic smoke tests. They serve as:

- Documentation for consumers
- Examples of harness usage patterns
- Validation that harnesses work correctly

### Test Structure

1. **Setup function**: Use `setupTest()` helper following existing patterns
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
- Only provide `provideNoopSkyAnimations()` from `@skyux/core` when the example's components rely on `_SkyAnimationEndHandlerDirective`, `_SkyTransitionEndHandlerDirective`, or `_SkyAnimationSlideComponent` from `@skyux/core`. It is unnecessary otherwise and should be omitted.
- Follow Angular testing best practices

### Test Patterns

- Use `async/await` for harness operations
- Use `expectAsync().toBeResolvedTo()` for async assertions
- Avoid manual `fixture.detectChanges()` and `fixture.whenStable()` calls after UI interactions; test harnesses automatically wait for the app to stabilize, so these calls are unnecessary and trigger redundant change detection cycles
- Group related tests in `describe` blocks for organization

### Examples to Reference

- Look at `libs/components/code-examples/src/lib/modules/lists/list-summary/basic/example.component.spec.ts` for a comprehensive code example spec that uses the `setupTest()` helper, `dataSkyId`/`.with()` filtering, and grouped `describe` blocks
- For deeper harness testing patterns, the harness's own unit tests (e.g. `libs/components/lists/testing/src/modules/repeater/repeater-harness.spec.ts`) exercise every harness method, but note they test the harness directly and do not follow the code example spec conventions described here
- Follow the structure in existing code example spec files

## Documentation Integration

- Add class names to the component's `documentation.json` file under `codeExamples` section
- Keep examples in sync with component and harness changes
- Ensure tests reflect current harness capabilities

## Development Workflow

- **Running tests**: `npx nx test code-examples --include="[workspace-relative path to file]"`
- **Linting**: `npx nx lint code-examples` to check for lint errors, use `--fix` flag to automatically fix issues
- **Validation**: Ensure all tests pass and demonstrate expected harness behavior
- **Maintenance**: Update tests when harnesses or components change

## Key Principles

1. **Comprehensive coverage** over minimal tests
2. **Clear demonstrations** of harness capabilities
3. **Consumer-focused** examples that teach proper usage
4. **Maintainable** test structure that's easy to understand and update
