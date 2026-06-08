---
applyTo: '**/libs/components/**/testing/src/modules/**'
description: 'SKY UX Copilot instructions for generating harnesses for components.'
---

# SKY UX Copilot Instructions: Harnesses

## Overview

Create test harnesses that provide a stable, user-centric API for interacting
with SKY UX components in automated tests. A harness exposes a component's
public behavior through async methods so consumers' tests do not depend on
internal DOM structure.

Before writing a new harness, **open a sibling harness in the same library (or a
similar component elsewhere) and mirror its structure.** Do not invent new
patterns. The examples below are real patterns drawn from the codebase.

## File Organization

- **Location**: `libs/components/<library>/testing/src/modules/<module>/`
- **Files** (one set per component):
  - `<component>-harness.ts` — the harness class
  - `<component>-harness-filters.ts` — the filter interface
  - `<component>-harness.spec.ts` — the harness tests
- **Wiring** (both required, easy to forget):
  - Export the harness **and** its filters from `testing/src/public-api.ts`.
  - Add both `docsIds` to the library's `documentation.json` under the group's
    `testing` section (see [Documentation](#documentation)).

## Choosing a base class

- **`SkyComponentHarness`** — default for most components. Provides the
  `getDataSkyIdPredicate` helper used by the static `with()` method.
- **`SkyQueryableComponentHarness`** — extend this instead when the harness
  represents an item whose consumers will query for child harnesses (it adds
  `queryHarness`, `queryHarnessOrNull`, and `queryHarnesses`). Example:
  repeater items.

Both come from `@skyux/core/testing`.

## Class Pattern

```typescript
import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyExampleHarnessFilters } from './example-harness-filters';

/**
 * Harness for interacting with an example component in tests.
 */
export class SkyExampleHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-example';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyExampleHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyExampleHarnessFilters,
  ): HarnessPredicate<SkyExampleHarness> {
    return SkyExampleHarness.getDataSkyIdPredicate(filters);
  }
}
```

### Required conventions

- **JSDoc is mandatory and load-bearing.** The class, every public method, and
  every filter member must have a JSDoc comment — these are published in the
  API docs. Mark `hostSelector` with `@internal`.
- **`hostSelector`** is the component's tag (e.g. `sky-example`) or, for a
  directive/element harness, a selector like `'input[skyFoo]'`.
- **`with()`** is always present and returns
  `<ThisHarness>.getDataSkyIdPredicate(filters)` (optionally chained with
  `.addOption(...)` for content filters — see below).

## Mapping component API to harness methods

| Component member        | Harness method(s)                                                   |
| ----------------------- | ------------------------------------------------------------------- |
| `@Input()` / `input()`  | `async get<Name>(): Promise<T>`                                     |
| `model()`               | `async get<Name>()` **and** `async set<Name>(value): Promise<void>` |
| Click/keyboard handlers | `async click()`, `async focus()`, etc.                              |
| Form value              | `async getValue()` / `async setValue(value)`                        |
| CSS-class / state       | boolean query, e.g. `async getStacked(): Promise<boolean>`          |
| Validation state        | `async hasRequiredError(): Promise<boolean>`                        |
| Child component         | sub-harness accessor (see below)                                    |

Prefer returning `undefined` for "not present" over an empty string when the
distinction is meaningful (e.g. avatar initials), and throw a descriptive error
when an action is invalid in the current state:

```typescript
if (!fileDrop) {
  throw new Error(
    'A new avatar cannot be selected because the canChange input is not set to true.',
  );
}
```

## Locators

Define private locators with `#` fields that map to CSS classes from the
component template. Use `locatorFor` when the element always exists and
`locatorForOptional` when it may be absent.

```typescript
#getButton = this.locatorFor('button.sky-colorpicker-button');
#getResetButton = this.locatorForOptional('button.sky-colorpicker-reset-button');
```

### Content rendered in an overlay

Modals, dropdowns, flyouts, and other overlay content render **outside** the
host element, so locating them from `this` will fail. Use
`documentRootLocatorFactory()` and locate from there:

```typescript
#documentRootLocator = this.documentRootLocatorFactory();
#errorModal = this.#documentRootLocator.locatorForOptional(SkyErrorModalHarness);
```

## Composing sub-harnesses

Reuse other components' harnesses instead of reaching into their DOM. Import
them from their package's `/testing` entry point and locate them like any other
element:

```typescript
import { SkyFileDropHarness } from '@skyux/forms/testing';
import { SkyHelpInlineHarness } from '@skyux/help-inline/testing';

#getFileDrop = this.locatorForOptional(SkyFileDropHarness);
#getHelpInline = this.locatorFor(SkyHelpInlineHarness);
```

Expose access through a method when consumers need the child harness directly:

```typescript
/**
 * Gets the help inline harness, or null if not present.
 */
public async getHelpInline(): Promise<SkyHelpInlineHarness | null> {
  return await this.#getHelpInline();
}
```

## Filters

Extend `SkyHarnessFilters` (from `@skyux/core/testing`). For many components an
empty extension is correct — `dataSkyId` filtering is inherited:

```typescript
import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria for filtering `SkyExampleHarness` instances.
 */
export interface SkyExampleHarnessFilters extends SkyHarnessFilters {}
```

### Content-based filters

When consumers should be able to find an instance by its text content, add a
`string | RegExp` option to the filter interface **and** wire it in `with()`
using `addOption` + `HarnessPredicate.stringMatches`:

```typescript
// filters
export interface SkyRepeaterItemHarnessFilters extends SkyHarnessFilters {
  /** Only find instances whose content matches the given value. */
  contentText?: string | RegExp;
}

// harness
public static with(
  filters: SkyRepeaterItemHarnessFilters,
): HarnessPredicate<SkyRepeaterItemHarness> {
  return SkyRepeaterItemHarness.getDataSkyIdPredicate(filters).addOption(
    'contentText',
    filters.contentText,
    async (harness, text) =>
      await HarnessPredicate.stringMatches(await harness.getContentText(), text),
  );
}
```

## Spec file pattern

Harness specs run on **Karma + Jasmine** and use the CDK testbed environment.
Define an internal `TestComponent`, drive inputs with `componentRef.setInput`,
and assert with `expectAsync(...).toBeResolvedTo(...)`.

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyExampleModule } from '@skyux/example';

import { SkyExampleHarness } from './example-harness';

@Component({
  imports: [SkyExampleModule],
  template: `<sky-example
    data-sky-id="test-example"
    [disabled]="disabled()"
  />`,
})
class TestComponent {
  public readonly disabled = input<boolean>();
}

describe('Example harness', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<TestComponent>;
    harness: SkyExampleHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyExampleHarness.with({ dataSkyId: 'test-example' }),
    );

    return { fixture, harness };
  }

  it('should get the disabled state', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getDisabled()).toBeResolvedTo(false);

    fixture.componentRef.setInput('disabled', true);

    await expectAsync(harness.getDisabled()).toBeResolvedTo(true);
  });
});
```

Cover, at minimum:

- Every public method (both states for booleans).
- `dataSkyId` filtering (and any content filters), including the "not found"
  case — `getHarness` rejects, so assert with `toBeRejected...`.
- Every thrown-error path.
- Sub-harness accessors and overlay interactions.

Most projects enforce **100% coverage** (statements, branches, functions,
lines).

## Documentation

Add both `docsIds` to the library's `documentation.json`, under the matching
group's `testing` section:

```json
"testing": {
  "docsIds": ["SkyExampleHarness", "SkyExampleHarnessFilters"]
}
```

## Running the tests

The testing project name is `<library>-testing` (not the library name):

```bash
npx nx test <library>-testing --browsers=ChromeHeadless
```

Examples:

- `npx nx test colorpicker-testing --browsers=ChromeHeadless`
- `npx nx test forms-testing --browsers=ChromeHeadless`

Then format any changed files: `nx format --files=<changed-file-paths>`.
