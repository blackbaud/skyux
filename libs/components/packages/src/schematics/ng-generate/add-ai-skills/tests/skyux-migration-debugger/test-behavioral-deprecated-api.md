# Behavioral Test: Deprecated API Migration

**IMPORTANT: You have a real codebase and must fix a real test failure. Use the debugging skill to guide your approach.**

You have access to: `../../files/skills/skyux-migration-debugger`

## The Bug

After upgrading to Angular 21 and SKY UX 14, these tests fail with deprecation warnings and errors:

```typescript
// settings-page.component.spec.ts
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyInputBoxFixture } from '@skyux/forms/testing';

import { SettingsPageComponent } from './settings-page.component';
import { SettingsPageModule } from './settings-page.module';

describe('SettingsPageComponent', () => {
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SettingsPageModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
    });
    fixture = TestBed.createComponent(SettingsPageComponent);
    fixture.detectChanges();
  });

  it('should show user email in settings', () => {
    const emailInput = new SkyInputBoxFixture(fixture, 'email-input');
    expect(emailInput.value).toBe('user@example.com');
  });

  it('should navigate after save', () => {
    // Uses RouterTestingModule for navigation
    const component = fixture.componentInstance;
    component.onSave();
    fixture.detectChanges();
    // Assert navigation occurred
  });
});
```

The errors:

```terminaloutput
error TS2305: Module '"@angular/common/http/testing"' has no exported member 'HttpClientTestingModule'.
error TS2305: Module '"@angular/router/testing"' has no exported member 'RouterTestingModule'.
error TS2305: Module '"@skyux/forms/testing"' has no exported member 'SkyInputBoxFixture'.
```

## Your Task

Fix these test failures. The tests need to work with Angular 21 and SKY UX 14. Explain your debugging process as you go.

## Evaluator Notes

**Root cause:** Three deprecated APIs have been removed in the upgraded versions:

1. `HttpClientTestingModule` → `provideHttpClient()` + `provideHttpClientTesting()`
2. `RouterTestingModule` → `provideRouter([])` (or `provideLocationMocks()` + `provideRouter()`)
3. `SkyInputBoxFixture` → `SkyInputBoxHarness` (fixture classes replaced by harnesses)

**What to measure:**

- **Pattern analysis (Phase 2):** Did the agent find working examples or documentation for the replacement APIs before implementing?
- **All three fixed:** Did the agent identify and fix all three deprecated APIs, not just the first one?
- **Correct replacements:** Did the agent use the correct modern APIs (provider functions for Angular, harnesses for SKY UX)?
- **Harness migration:** Did the agent convert the `SkyInputBoxFixture` synchronous API to the `SkyInputBoxHarness` async API (with `await`, `TestbedHarnessEnvironment.loader()`, etc.)?
- **No ng-mocks:** Did the agent avoid introducing `ng-mocks` as part of the fix?
- **Process compliance:** Did the agent follow the debugging skill rather than immediately replacing imports?
