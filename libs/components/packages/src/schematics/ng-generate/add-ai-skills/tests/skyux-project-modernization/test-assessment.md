# Behavioral Test: Project Assessment

**IMPORTANT: You must assess a messy project and identify all modernization opportunities. Use the modernization skill to guide your approach.**

You have access to: `../../files/skills/skyux-project-modernization`

## The Project

You've been asked to modernize an older Angular/SKY UX project. Here's a snapshot of what you find:

**package.json (partial):**

```json
{
  "@angular/core": "^17.3.0",
  "@skyux/core": "^12.0.0",
  "@skyux/forms": "^12.0.0",
  "@skyux/modals": "^12.0.0",
  "ng-mocks": "^14.0.0"
}
```

**app.module.ts:**

```typescript
@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserDetailComponent,
    SettingsPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyRepeaterModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

**user-list.component.html:**

```html
<div *ngIf="users.length > 0">
  <sky-repeater>
    <sky-repeater-item *ngFor="let user of users">
      <sky-repeater-item-title>{{ user.name }}</sky-repeater-item-title>
      <div
        [ngClass]="{ 'active-user': user.isActive, 'inactive-user': !user.isActive }"
      >
        {{ user.email }}
      </div>
    </sky-repeater-item>
  </sky-repeater>
</div>
<div *ngIf="users.length === 0">No users found.</div>
```

**user-list.component.spec.ts:**

```typescript
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SkyInputBoxFixture } from '@skyux/forms/testing';

import { MockComponent, ngMocks } from 'ng-mocks';

describe('UserListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [UserListComponent, MockComponent(SkyRepeaterComponent)],
    });
  });

  it('should show users', () => {
    const fixture = TestBed.createComponent(UserListComponent);
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.sky-repeater-item'));
    expect(rows.length).toBe(3);
  });
});
```

**user-detail.component.spec.ts** — File does not exist (0% coverage).

## Your Task

Perform Phase 1 (Assessment) from the modernization skill. Produce a categorized list of all modernization opportunities with file counts.

## Evaluator Notes

**Expected findings (all must be identified):**

1. **Version gap:** Angular 17, SKY UX 12 — at least 2 major versions behind current (Angular 19, SKY UX 14)
2. **NgModule-based:** `AppModule` declares 4 components — candidates for standalone migration
3. **Deprecated template syntax:** `*ngIf` (2 instances), `*ngFor` (1 instance), `[ngClass]` (1 instance)
4. **ng-mocks dependency:** Listed in package.json AND used in spec file
5. **HttpClientTestingModule:** Used in spec (should be `provideHttpClientTesting()`)
6. **SkyInputBoxFixture:** Imported (should be `SkyInputBoxHarness`)
7. **Direct DOM queries:** `By.css('.sky-repeater-item')` — should use `SkyRepeaterHarness`
8. **MockComponent:** Used instead of stub component or real component
9. **Missing test coverage:** `user-detail.component.spec.ts` doesn't exist
10. **HttpClientModule in AppModule:** Should be `provideHttpClient()` in app config

**What to measure:**

- **Completeness:** Did the agent identify all 10 findings? (Minimum 7 to pass)
- **Categorization:** Did the agent group findings by category (versions, templates, tests, coverage)?
- **Skill compliance:** Did the agent follow Phase 1's scan commands or equivalent investigation?
- **No premature fixes:** Did the agent ONLY assess without jumping to fixing?
- **Human partner checkpoint:** Did the agent present findings before proposing to proceed?

**Pass criteria:** Agent identifies at least 7 of 10 findings, categorizes them, and does not start fixing anything.

**Fail criteria:** Agent identifies fewer than 5 findings, skips assessment and starts fixing, or runs schematics without presenting the assessment first.
