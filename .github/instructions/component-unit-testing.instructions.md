---
applyTo: '**/libs/components/*/src/lib/**/*.spec.ts, !**/libs/components/code-examples/**'
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
  [component-code-examples.instructions.md](./component-code-examples.instructions.md).
- **Harness specs** (`libs/components/**/testing/src/**`) — follow
  [component-harnesses.instructions.md](./component-harnesses.instructions.md).

This file is your blueprint. The setup, matchers, and `a11y` patterns below are
canonical and self-contained, so you should **not** need to copy another spec to
write a new one. Many existing specs predate these conventions (NgModule
`declarations`, setting properties on the host instead of `setInput`, no `a11y`
block, `fakeAsync`/`tick` where `whenStable` would do); **do not treat a
neighboring spec as a template** or you will inherit those dated idioms.

It is fine to open an existing spec to look up **facts you cannot otherwise
infer** — whether a `*.module.fixture.ts` exists for the component, or which
providers the component actually needs at runtime. Take only those facts; do not
adopt the file's structure, async style, or assertions.

This is a **Karma + Jasmine + zone.js** project. Some
[angular.dev](https://angular.dev/guide/testing/components-scenarios) testing
guidance targets the Vitest runner and zoneless change detection and does **not**
apply here: keep using Jasmine spies (not `vi.*`) and `fakeAsync`/`tick`/`flush`
(not Vitest fake timers).

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

Choose the setup that fits the component:

- **Self-contained component with signal inputs** — create the subject directly
  with `TestBed.createComponent(SkyExample)` and drive it with `setInput` (see
  _Driving inputs & change detection_). This is the simplest setup; prefer it
  when the component needs no projected content.
- **Everything else** (content projection, `ng-template`, or a provided
  `<name>.module.fixture.ts`) — drive the component through a **host/wrapper
  `TestComponent`** rather than instantiating the subject directly, and import
  the fixtures module when one exists.

In both cases, configure the testing module with the providers the component
needs. **Create the fixture in `beforeEach`, but do not trigger change detection
there.** Angular's first change-detection pass runs `ngOnInit`/`ngOnChanges`, so
deferring it lets each test set inputs _before_ the component first renders. Each
test sets its inputs and then awaits `fixture.whenStable()` to render (see
_Driving inputs & change detection_).

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

    // Create the fixture only. Do not render yet — each test sets its inputs
    // first, then awaits whenStable() to trigger the initial change detection.
    fixture = TestBed.createComponent(SkyExampleTestComponent);
  });
});
```

Common providers (add only what the component needs):

- `provideNoopSkyAnimations()` from `@skyux/core` — suppress animations.
- `provideRouter([])` — components that use routing.
- `provideSkyMediaQueryTesting()` — responsive behavior.
- A mocked `SkyThemeService` for theme-aware components.

## Driving inputs & change detection

- For signal-based components tested without a host wrapper, set inputs with
  `fixture.componentRef.setInput('labelText', '...')`. This is the current
  Angular approach — prefer it over a host wrapper for new, self-contained
  components.
- For module-based fixtures, set fields on the **host `TestComponent`** instance
  (`fixture.componentInstance.labelText = '...'`). Reach the subject with
  `@ViewChild` when you need its instance.
- To render those changes, call `fixture.detectChanges()`, or
  `await fixture.whenStable()` to also flush the initial render and any pending
  microtasks — the latter is what current Angular generates and is preferred for
  new `async` specs (and before loading a harness).
- Use `fakeAsync` + `tick()`/`flush()` to control timer-based async such as
  animations and debounces. Because this repo runs on Karma + Jasmine with
  zone.js, keep using these; the "`fakeAsync` is discouraged" note on
  angular.dev applies only to zoneless Vitest projects.

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
asserts the rendered output is accessible in each meaningful state. A
"meaningful state" is one that changes the rendered DOM in a way a keyboard or
screen-reader user would perceive — not every input permutation. Add an
assertion for each such state, for example:

- label present vs. absent (and help text, hint text, descriptions)
- valid vs. invalid/error, required vs. optional
- enabled vs. disabled, expanded vs. collapsed, selected vs. unselected
- empty vs. populated content

You do not need a separate assertion for inputs that only alter styling (a
color, a width) without changing structure, roles, names, or states. Branch and
code-path coverage belongs to the behavioral tests; the `a11y` block targets
distinct accessible renderings.

```typescript
describe('a11y', () => {
  it('should be accessible', async () => {
    fixture.componentInstance.labelText = 'Example';
    await fixture.whenStable();

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
