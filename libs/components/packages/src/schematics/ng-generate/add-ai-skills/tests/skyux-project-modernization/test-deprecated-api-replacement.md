# Behavioral Test: Deprecated API Replacement

**IMPORTANT: You must fix deprecated patterns in a test file. Use the modernization skill's Phase 3 guidance.**

You have access to: `../../files/skills/skyux-project-modernization`

## The File

Phase 2 (schematics) is complete. Your human partner has approved proceeding with Phase 3. Here's a test file with multiple deprecated patterns:

```typescript
// order-form.component.spec.ts
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SkyInputBoxFixture } from '@skyux/forms/testing';
import { SkyModalService } from '@skyux/modals';

import { MockComponent, ngMocks } from 'ng-mocks';

import { OrderFormComponent } from './order-form.component';
import { OrderSummaryComponent } from './order-summary.component';

describe('OrderFormComponent', () => {
  let fixture: ComponentFixture<OrderFormComponent>;
  let httpMock: HttpTestingController;
  let mockModalService: jasmine.SpyObj<SkyModalService>;

  beforeEach(() => {
    mockModalService = jasmine.createSpyObj('SkyModalService', [
      'open',
      'close',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrderFormComponent, MockComponent(OrderSummaryComponent)],
      providers: [{ provide: SkyModalService, useValue: mockModalService }],
    });

    fixture = TestBed.createComponent(OrderFormComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should load order details', () => {
    const inputFixture = new SkyInputBoxFixture(fixture, 'order-name');
    expect(inputFixture.value).toBe('New Order');
  });

  it('should show order items in list', () => {
    httpMock
      .expectOne('/api/orders/123')
      .flush({ items: [{ name: 'Widget' }] });
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('.sky-repeater-item'));
    expect(items.length).toBe(1);
  });

  it('should open confirmation modal', () => {
    fixture.componentInstance.onSubmit();
    expect(mockModalService.open).toHaveBeenCalled();
  });
});
```

## Your Task

Fix ALL deprecated patterns in this file. Follow the modernization skill's Phase 3 priority order. Show the corrected file.

## Evaluator Notes

**Deprecated patterns present (7 total):**

1. `HttpClientTestingModule` → `provideHttpClient()` + `provideHttpClientTesting()`
2. `RouterTestingModule` → `provideRouter([])`
3. `MockComponent` (ng-mocks) → stub component
4. `ngMocks` import → remove
5. `SkyInputBoxFixture` → `SkyInputBoxHarness` (sync → async)
6. `By.css('.sky-repeater-item')` → `SkyRepeaterHarness` or `By.css('[data-sky-id="..."]')`
7. `jasmine.createSpyObj` for `SkyModalService` → `SkyModalTestingController` + `SkyModalTestingModule`

**What to measure:**

- **All 7 fixed:** Did the agent identify and fix all deprecated patterns?
- **Correct replacements:** Are the modern replacements correct (not just different deprecated patterns)?
- **Async conversion:** Did the agent convert the SkyInputBoxFixture test to async with harness?
- **Testing controller:** Did the agent use `SkyModalTestingController` instead of the spy object?
- **No ng-mocks:** Did the agent remove ALL ng-mocks usage (import + MockComponent)?
- **Harness for DOM queries:** Did the agent replace `.sky-repeater-item` with a harness or `data-sky-id`?
- **Working code:** Would the corrected file actually compile and run?

**Pass criteria:** Agent fixes all 7 patterns with correct modern replacements. The corrected file would compile.

**Fail criteria:** Agent misses 3+ patterns, uses incorrect replacements, or produces code that wouldn't compile.
