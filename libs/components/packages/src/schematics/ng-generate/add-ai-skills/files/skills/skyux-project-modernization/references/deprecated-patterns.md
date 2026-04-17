# Deprecated Patterns and Modern Replacements

**Load this reference when:** fixing deprecated APIs, replacing outdated test patterns, or modernizing component code.

## Test Infrastructure

| Deprecated Pattern                                    | Modern Replacement                                                    | Notes                                                                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `Sky*Fixture` (e.g., `SkyInputBoxFixture`)            | `Sky*Harness` (e.g., `SkyInputBoxHarness`)                            | Sync → async conversion required. Test must become `async`. Use `TestbedHarnessEnvironment.loader(fixture)` to get harness. |
| `HttpClientTestingModule`                             | `provideHttpClient()` + `provideHttpClientTesting()`                  | Place in `providers` array, not `imports`.                                                                                  |
| `RouterTestingModule`                                 | `provideRouter([])`                                                   | For route testing, use `RouterTestingHarness`.                                                                              |
| `ng-mocks` (`MockComponent`, `MockModule`, `ngMocks`) | Stub components or `fixture.debugElement.query(By.directive(...))`    | ng-mocks hijacks Angular's real DI/template behavior.                                                                       |
| `jasmine.createSpyObj` for SKY UX services            | Testing controllers (`SkyModalTestingController`, etc.)               | Testing controllers provide realistic behavior and are maintained by the SKY UX team.                                       |
| `By.css('.sky-internal-class')`                       | `loader.getHarness(SkyXxxHarness)` or `By.css('[data-sky-id="xxx"]')` | Internal CSS classes change between versions. Harnesses and `data-sky-id` are stable.                                       |
| `Sky*TestingModule` (e.g., `SkyCoreTestingModule`)    | Provider functions (e.g., `provideSkyMediaQueryTesting()`)            | Testing modules replaced by tree-shakable provider functions.                                                               |

## Component Patterns

| Deprecated Pattern                        | Modern Replacement                              | Schematic Available?                  |
| ----------------------------------------- | ----------------------------------------------- | ------------------------------------- |
| `@NgModule` with `declarations`           | Standalone components with `imports`            | Yes: `@skyux/packages:standalone`     |
| `*ngIf` / `*ngFor` / `*ngSwitch`          | `@if` / `@for` / `@switch` control flow         | Yes: `@angular/core:control-flow`     |
| `[ngClass]="{ 'cls': condition }"`        | `[class.cls]="condition"`                       | Yes: `@angular/core:ngclass-to-class` |
| Constructor injection                     | `inject()` function in field initializers       | Yes: `@angular/core:inject-migration` |
| `@ViewChild` / `@ContentChild` decorators | `viewChild()` / `contentChild()` signal queries | Manual (Angular 17+)                  |
| `@Input()` / `@Output()` decorators       | `input()` / `output()` signal-based             | Manual (Angular 17+)                  |

## Service Patterns

| Deprecated Pattern                                    | Modern Replacement                            | Notes                                                                         |
| ----------------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| Class-based `HttpInterceptor`                         | `HttpInterceptorFn` with `withInterceptors()` | Register via `provideHttpClient(withInterceptors([...]))`                     |
| Class-based route guards (`CanActivate`)              | `CanActivateFn` functional guards             | Function signature: `(route, state) => boolean \| UrlTree \| Observable<...>` |
| Class-based route resolvers (`Resolve`)               | `ResolveFn` functional resolvers              | Function signature: `(route, state) => Observable<T>`                         |
| `loadChildren: () => import(...).then(m => m.Module)` | `loadComponent: () => import(...)`            | Yes: `@angular/core:route-lazy-loading`                                       |

## SKY UX Component Migrations

| Deprecated Component                     | Modern Replacement           | Schematic Available?                                                   |
| ---------------------------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `<sky-definition-list>`                  | `<sky-description-list>`     | Yes: `@skyux/packages:convert-definition-list-to-description-list`     |
| `<sky-page-summary>`                     | `<sky-page-header>`          | Yes: `@skyux/packages:convert-page-summary-to-page-header`             |
| `<sky-progress-indicator>` (wizard mode) | `<sky-tabset>` (wizard mode) | Yes: `@skyux/packages:convert-progress-indicator-wizard-to-tab-wizard` |

## How to Fix: Test Infrastructure Examples

### Sky*Fixture → Sky*Harness

```typescript
// ❌ DEPRECATED: Fixture (synchronous)
import { SkyAvatarFixture } from '@skyux/avatar/testing';

it('should show initials', () => {
  const avatar = new SkyAvatarFixture(fixture, 'test-avatar');
  expect(avatar.initials).toBe('JD');
});
```

```typescript
// ✅ CURRENT: Harness (async)
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { SkyAvatarHarness } from '@skyux/avatar/testing';

it('should show initials', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const avatar = await loader.getHarness(
    SkyAvatarHarness.with({ dataSkyId: 'test-avatar' }),
  );
  await expectAsync(avatar.getInitials()).toBeResolvedTo('JD');
});
```

### HttpClientTestingModule → Provider Functions

```typescript
// ❌ DEPRECATED
import { HttpClientTestingModule } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});
```

```typescript
// ✅ CURRENT
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
```

### RouterTestingModule → provideRouter

```typescript
// ❌ DEPRECATED
import { RouterTestingModule } from '@angular/router/testing';

TestBed.configureTestingModule({
  imports: [RouterTestingModule],
});
```

```typescript
// ✅ CURRENT
import { provideRouter } from '@angular/router';

TestBed.configureTestingModule({
  providers: [provideRouter([])],
});
```

### ng-mocks → Native Angular

```typescript
// ❌ ng-mocks
import { MockComponent, ngMocks } from 'ng-mocks';

TestBed.configureTestingModule({
  declarations: [MockComponent(ChildComponent)],
});
const child = ngMocks.find(ChildComponent).componentInstance;

// ✅ Native Angular
@Component({ template: '' })
class StubChildComponent {}

TestBed.configureTestingModule({
  imports: [StubChildComponent],
});
const child = fixture.debugElement.query(
  By.directive(StubChildComponent),
).componentInstance;
```

### Direct DOM Queries → Harness

```typescript
// ❌ Fragile: internal CSS class
const el = fixture.debugElement.query(By.css('.sky-input-box-input'));

// ✅ Stable: harness
const loader = TestbedHarnessEnvironment.loader(fixture);
const inputBox = await loader.getHarness(
  SkyInputBoxHarness.with({ dataSkyId: 'my-input' }),
);

// ✅ Acceptable fallback: data-sky-id (when no harness exists)
const el = fixture.debugElement.query(By.css('[data-sky-id="my-element"]'));
```

## Available Testing Controllers

Use these instead of `jasmine.createSpyObj` for SKY UX services:

| Package                 | Controller                       | Module                              | Purpose              |
| ----------------------- | -------------------------------- | ----------------------------------- | -------------------- |
| `@skyux/modals/testing` | `SkyModalTestingController`      | `SkyModalTestingModule`             | Mock modals          |
| `@skyux/modals/testing` | `SkyConfirmTestingController`    | `SkyConfirmTestingModule`           | Mock confirm dialogs |
| `@skyux/core/testing`   | `SkyMediaQueryTestingController` | `provideSkyMediaQueryTesting()`     | Mock breakpoints     |
| `@skyux/core/testing`   | `SkyHelpTestingController`       | `SkyHelpTestingModule`              | Mock help panel      |
| `@skyux/core/testing`   | —                                | `provideSkyFileReaderTesting()`     | Mock file reader     |
| `@skyux/forms/testing`  | —                                | `provideSkyFileAttachmentTesting()` | Mock file attachment |
