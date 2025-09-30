---
applyTo: '**'
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
  - `LayoutActionBarsModalExampleComponent`

## Test Content Requirements

### Purpose

These tests should be **thorough showcases** of test harness capabilities, not just basic smoke tests. They serve as:

- Documentation for consumers
- Examples of harness usage patterns
- Validation that harnesses work correctly

### Test Structure

1. **Setup function**: Use `setupTest()` helper that returns `{ fixture, loader, component }`
2. **Basic tests**: Component creation, rendering, initial state verification
3. **Harness demonstrations**: Show all relevant harness methods and capabilities
4. **User interaction tests**: Demonstrate clicking, form input, and state changes
5. **Feature-specific tests**: Group related functionality in `describe` blocks when appropriate

### Harness Coverage

- Demonstrate **all public methods** of relevant harnesses
- Show **filtering capabilities** using the harness filter interfaces:
  - Test `dataSkyId` filtering (inherited from `SkyHarnessFilters`)
  - Test component-specific filter properties (e.g., `viewId`, `buttonType`, `text`)
  - Use `ComponentHarness.with(filters)` to demonstrate predicate filtering
- Include **error scenarios** where appropriate (e.g., missing elements)
- Test **interactions** (clicks, form submissions, state changes)
- Showcase **sub-harness access** (context menus, forms, buttons, etc.)

## Code Quality Standards

### Dependencies

- Import test harnesses from appropriate testing modules
- Use `provideNoopAnimations()` instead of `NoopAnimationsModule` for Angular 18+
- Follow Angular testing best practices

### Test Patterns

- Use `async/await` for harness operations
- Use `expectAsync().toBeResolvedTo()` for async assertions
- Use `fixture.detectChanges()` and `fixture.whenStable()` after UI interactions
- Group related tests in `describe` blocks for organization
- Always check the terminal output completely before assuming test results

### Setup Function Pattern

```typescript
async function setupTest(): Promise<{
  fixture: ComponentFixture<ComponentName>;
  loader: HarnessLoader;
  component: ComponentName;
}> {
  await TestBed.configureTestingModule({
    imports: [ComponentName],
    providers: [provideNoopAnimations()],
  }).compileComponents();

  const fixture = TestBed.createComponent(ComponentName);
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const component = fixture.componentInstance;

  return { fixture, loader, component };
}
```

### Common Patterns and Pitfalls

- **Harness method availability**: Check harness implementation before using methods (e.g., some methods may not exist on all harnesses)

### Error Handling

- Verify harness methods exist before calling them
- Check for optional harnesses using `queryHarness()` instead of `getHarness()`

### Examples to Reference

- Look at harness spec files in `libs/components/*/testing/src/modules/*/` for comprehensive harness testing patterns
- Follow the structure in existing code example spec files

## Documentation Integration

- Add class names to the component's `documentation.json` file under `codeExamples` section
- Keep examples in sync with component and harness changes
- Ensure tests reflect current harness capabilities

## Development Workflow

- **Running tests**: `npx nx test code-examples --include="**/[example-folder]/example.component.spec.ts"`
- **Wait for completion**: Always wait for the complete test run including coverage summary before checking results
- **Linting**: `npx nx lint code-examples` to check for lint errors, use `--fix` flag to automatically fix issues
- **Incremental development**: Work incrementally, running tests after each change to catch errors early
- **Validation**: Ensure all tests pass and demonstrate expected harness behavior
- **Maintenance**: Update tests when harnesses or components change

### Debugging Tips

- Check terminal output completely for TypeScript errors before assuming test failures
- Verify imports are used to avoid "unused import" errors
- Check harness documentation for available methods and properties
- Verify component state directly when harness methods don't provide needed access

## Key Principles

1. **Comprehensive coverage** over minimal tests
2. **Clear demonstrations** of harness capabilities
3. **Consumer-focused** examples that teach proper usage
4. **Maintainable** test structure that's easy to understand and update
5. **Incremental development** - build tests step by step, running frequently
6. **Real-world scenarios** - test actual user workflows, not just API calls
7. **Error prevention** - anticipate common pitfalls and test edge cases
8. **Documentation value** - tests should serve as usage examples for harnesses
