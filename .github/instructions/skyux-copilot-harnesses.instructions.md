---
applyTo: '**'
description: 'SKY UX Copilot instructions for generating harnesses for components.'
---

# SKY UX Copilot Instructions: Harnesses

## Overview

Create test harnesses that provide a stable API for interacting with SKY UX components in automated tests. Harnesses should expose the component's public functionality through user-centric methods.

## Basic Structure

### File Organization

- **Location**: `libs/components/[component]/testing/src/modules/[component]/`
- **Files**:
  - `[component]-harness.ts` - Main harness class
  - `[component]-harness-filters.ts` - Filter interface
  - `[component]-harness.spec.ts` - Tests

### Class Pattern

```typescript
export class Sky[Component]Harness extends SkyComponentHarness {
  public static hostSelector = 'sky-[component]';

  public static with(filters: Sky[Component]HarnessFilters): HarnessPredicate<Sky[Component]Harness> {
    return Sky[Component]Harness.getDataSkyIdPredicate(filters);
  }
}
```

## Mapping Component API to Harness Methods

### Component Inputs → Getter Methods

Map `@Input()` properties to async getter methods:

- `@Input() labelText: string` → `async getLabelText(): Promise<string>`
- `@Input() disabled: boolean` → `async getDisabled(): Promise<boolean>`

### Template Interactions → Action Methods

Map user interactions to async action methods:

- Click handlers → `async click(): Promise<void>`
- Form inputs → `async setValue(value: string): Promise<void>`

### Component State → Query Methods

Map component state to boolean query methods:

- CSS classes → `async getStacked(): Promise<boolean>`
- Validation states → `async hasRequiredError(): Promise<boolean>`

### Child Components → Sub-Harness Access

Provide access to child component harnesses:

- `<sky-help-inline>` → `async getHelpInline(): Promise<SkyHelpInlineHarness>`

## Implementation Guidelines

### Locators

Use private locators that map to CSS classes from the component template:

```typescript
#getLabel = this.locatorForOptional('.sky-control-label');
#getWrapper = this.locatorFor('.sky-[component]');
```

### Filter Interface

Extend `SkyHarnessFilters` with component-specific properties:

```typescript
export interface Sky[Component]HarnessFilters extends SkyHarnessFilters {
  text?: string | RegExp;
  disabled?: boolean;
}
```

### Error Handling

Throw descriptive errors for invalid operations:

```typescript
if (!feature) {
  throw new Error('Feature not available in current component state.');
}
```

## Testing

- Test all public methods
- Test filter functionality
- Test error scenarios
- Include comprehensive examples

## Documentation Integration

- Add harness class names to the component's `documentation.json` file under the `testing` section
- Include filter interface in documentation
- Keep harnesses synchronized with component API changes
