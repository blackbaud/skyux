---
applyTo: '**/libs/components/*/src/lib/**/*.{component,directive}.spec.ts, !**/libs/components/code-examples/**'
description: 'SKY UX Copilot instructions for writing unit tests for library components and directives.'
---

# SKY UX Copilot Instructions: Component & Directive Unit Tests

## Overview

Write Karma + Jasmine unit tests for the components and directives that ship
from a `@skyux/*` library (the source under
`libs/components/<library>/src/lib/**`). SKY UX styles are loaded during these
tests, so computed styles and accessibility are assertable.

This guidance is for **library source specs**. It does not cover:

- **Code-example specs** (`libs/components/code-examples/**`) — follow
  [code-examples-unit-testing.instructions.md](./code-examples-unit-testing.instructions.md).
- **Harness specs** (`libs/components/**/testing/src/**`) — follow
  [skyux-copilot-harnesses.instructions.md](./skyux-copilot-harnesses.instructions.md).

Before writing, **open a sibling spec in the same library and mirror its
structure.** Do not invent new patterns. The examples below are real patterns
drawn from the codebase.

## File & naming

- Co-locate the spec with its subject:
  `libs/components/<library>/src/lib/modules/<module>/<name>.component.spec.ts`
  (or `<name>.directive.spec.ts`).
- Name the top-level `describe` after the subject, e.g.
  `describe('Token component', ...)`. Group variations and accessibility in
  nested `describe` blocks (`describe('a11y', ...)`).
- Put shared helper functions at the top of the `describe` block, above
  `beforeEach`.

## Test setup

Drive the component through a **host/wrapper `TestComponent`** rather than
instantiating the subject directly. Many libraries provide a fixtures module
(`<name>.module.fixture.ts`); import that. Configure the testing module with the
providers the component needs.

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { SkyExampleFixturesModule } from './fixtures/example.module.fixture';
import { SkyExampleTestComponent } from './fixtures/example.component.fixture';

describe('Example component', () => {
  let fixture: ComponentFixture<SkyExampleTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyExampleFixturesModule],
      providers: [provideNoopSkyAnimations()],
    });

    fixture = TestBed.createComponent(SkyExampleTestComponent);
    fixture.detectChanges();
  });
});
```

Common providers (add only what the component needs):

- `provideNoopSkyAnimations()` from `@skyux/core` — suppress animations.
- `provideRouter([])` — components that use routing.
- `provideSkyMediaQueryTesting()` — responsive behavior.
- A mocked `SkyThemeService` for theme-aware components.

## Driving inputs & change detection

- For module-based fixtures, set fields on the **host `TestComponent`** instance
  (`fixture.componentInstance.labelText = '...'`), then call
  `fixture.detectChanges()`. Reach the subject with `@ViewChild` when you need
  its instance.
- For modern signal-based components tested without a host wrapper, use
  `fixture.componentRef.setInput('labelText', '...')`.
- Use `fakeAsync` + `tick()` (or `flush()`) for timer-based async such as
  animations and debounces; use `await fixture.whenStable()` when awaiting
  promises/observables (e.g. before loading a harness).
- Fire DOM events with `SkyAppTestUtility.fireDomEvent(element, 'click')` from
  `@skyux-sdk/testing`.

## Assertions & matchers

Import `expect`/`expectAsync` from `@skyux-sdk/testing` (this registers the SKY
custom matchers); standard Jasmine matchers remain available.

```typescript
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
```

Useful SKY matchers (from `@skyux-sdk/testing`):

- `expect(el).toHaveCssClass('sky-...')` / `.not.toHaveCssClass(...)`
- `expect(el).toBeVisible()` / `expect(el).toExist()`
- `expect(el).toHaveText('...')` / `toHaveResourceText(...)` /
  `toHaveLibResourceText(...)` for i18n strings
- `await expectAsync(fixture.nativeElement).toBeAccessible()` — see below

## Accessibility

Accessibility coverage is expected. Add a `describe('a11y', ...)` block that
asserts the rendered output is accessible in each meaningful state:

```typescript
describe('a11y', () => {
  it('should be accessible', async () => {
    fixture.componentInstance.labelText = 'Example';
    fixture.detectChanges();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
```

`toBeAccessible()` runs axe-core. There is no `.not.toBeAccessible()`.

## Mocking

- `jasmine.createSpyObj('Name', ['methodA', 'methodB'])` for full mock objects;
  provide them via `{ provide: SomeService, useValue: spy }`.
- `spyOn(obj, 'method').and.returnValue(...)` / `.and.callThrough()` for methods;
  `spyOnProperty(obj, 'prop', 'get')` for accessors.
- Assert with `.toHaveBeenCalled()`, `.toHaveBeenCalledWith(...)`,
  `.toHaveBeenCalledTimes(n)`.

## Coverage

Most `libs/components/*` projects enforce **100% coverage** (statements,
branches, functions, lines) — see the project's `karma.conf.js`. Cover every
input/output, branch, and error path.

## Running the tests

```bash
npx nx test <library> --browsers=ChromeHeadless
```

`<library>` is the directory name (e.g. `forms`, `indicators`), not the package
name. Append `--watch` while iterating. Then format any changed files:
`nx format --files=<changed-file-paths>`.
