# Behavioral Test: Multi-File Dependency Chain

**IMPORTANT: You have a real codebase and must fix a real test failure. Use the debugging skill to guide your approach.**

You have access to: `../../files/skills/skyux-migration-debugger`

## The Bug

After running `ng update @angular/core@19`, the following test fails:

```typescript
// user-dashboard.component.spec.ts
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { UserDashboardComponent } from './user-dashboard.component';

describe('UserDashboardComponent', () => {
  let fixture: ComponentFixture<UserDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserDashboardComponent],
    });
    fixture = TestBed.createComponent(UserDashboardComponent);
    fixture.detectChanges();
  });

  it('should show user name in the header input', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBox = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'user-name' }),
    );
    const value = await inputBox.getValue();
    expect(value).toBe('Jane Doe');
  });
});
```

The error:

```terminaloutput
NullInjectorError: R3InjectorError(Standalone[UserDashboardComponent])[UserProfileService -> AuthTokenService -> AuthTokenService]:
  NullInjectorError: No provider for AuthTokenService
```

Here are the relevant files:

```typescript
// user-dashboard.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { SkyInputBoxModule } from '@skyux/forms';

import { UserProfileService } from '../services/user-profile.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [SkyInputBoxModule],
  template: `
    <sky-input-box data-sky-id="user-name">
      <label>User Name</label>
      <input type="text" [value]="userName" />
    </sky-input-box>
  `,
})
export class UserDashboardComponent implements OnInit {
  protected userName = '';
  readonly #profileService = inject(UserProfileService);

  ngOnInit(): void {
    this.userName = this.#profileService.getCurrentUser().name;
  }
}
```

```typescript
// services/user-profile.service.ts
import { Injectable, inject } from '@angular/core';

import { AuthTokenService } from './auth-token.service';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  readonly #authToken = inject(AuthTokenService);

  public getCurrentUser(): { name: string; email: string } {
    const token = this.#authToken.getToken();
    // Decode user from token...
    return { name: 'Jane Doe', email: 'jane@example.com' };
  }
}
```

```typescript
// services/auth-token.service.ts — THIS FILE WAS CHANGED BY ng update
// Before ng update: @Injectable({ providedIn: 'root' })
// After ng update: the migration removed providedIn because the service
// was also listed in a deleted AppModule's providers array.
import { Injectable } from '@angular/core';

@Injectable() // <-- No longer providedIn: 'root'
export class AuthTokenService {
  public getToken(): string {
    return localStorage.getItem('auth_token') ?? '';
  }
}
```

## Your Task

Fix this test failure. Explain your debugging process as you go.

## Evaluator Notes

**Root cause:** The `ng update` migration removed `providedIn: 'root'` from `AuthTokenService` because it was also registered in a now-deleted `AppModule`. The error appears on `UserDashboardComponent` but the root cause is two files away in `AuthTokenService`. The fix is to restore `providedIn: 'root'` on `AuthTokenService`.

**What to measure:**

- **Multi-file tracing:** Did the agent trace the dependency chain (Component → UserProfileService → AuthTokenService) rather than stopping at the first file?
- **Root cause identification:** Did the agent identify `AuthTokenService` missing `providedIn: 'root'` as the root cause, not try to add providers to the test's `TestBed`?
- **No band-aid fix:** Did the agent avoid adding `{ provide: AuthTokenService, useValue: ... }` to the test as a workaround? The correct fix is at the source, not in the test.
- **Migration awareness:** Did the agent recognize this as an `ng update` migration side-effect?
- **Process compliance:** Did the agent follow Phase 1 (read error, trace data flow) before proposing a fix?
- **Single fix:** Did the agent make one change (restore `providedIn: 'root'`) rather than multiple changes?
