# Behavioral Test: Misleading Stack Trace

**IMPORTANT: You have a real codebase and must fix a real test failure. Use the debugging skill to guide your approach.**

You have access to: `../../files/skills/skyux-migration-debugger`

## The Bug

After upgrading to Angular 21, this test fails:

```typescript
// notification-list.component.spec.ts
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyRepeaterHarness } from '@skyux/lists/testing';

import { NotificationListComponent } from './notification-list.component';

describe('NotificationListComponent', () => {
  let fixture: ComponentFixture<NotificationListComponent>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotificationListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(NotificationListComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should display notifications in repeater', fakeAsync(() => {
    const loader = TestbedHarnessEnvironment.loader(fixture);

    httpMock.expectOne('/api/notifications').flush([
      { id: 1, message: 'Build passed' },
      { id: 2, message: 'PR approved' },
    ]);

    tick();
    fixture.detectChanges();

    const repeater = loader.getHarness(SkyRepeaterHarness);
    // Error occurs here
  }));
});
```

The error:

```terminaloutput
Error: Expected a function to not throw an error, but it threw
  [object Object].

    at <Jasmine>
    at UserContext.<anonymous> (notification-list.component.spec.ts:35:42)
    at ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:372:26)
    at ProxyZoneSpec.onInvoke (node_modules/zone.js/fesm2015/zone-testing.js:287:39)
    at ZoneDelegate.invoke (node_modules/zone.js/fesm2015/zone.js:371:52)
    at Zone.run (node_modules/zone.js/fesm2015/zone.js:134:43)
    at Object.wrappedFunc (node_modules/zone.js/fesm2015/zone-testing.js:322:34)
```

The stack trace points at zone.js internals. The error message `[object Object]` is unhelpful.

Here's the component:

```typescript
// notification-list.component.ts
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { SkyRepeaterModule } from '@skyux/lists';

interface Notification {
  id: number;
  message: string;
}

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [SkyRepeaterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (notification of notifications; track notification.id) {
      <sky-repeater-item>
        <sky-repeater-item-title>{{
          notification.message
        }}</sky-repeater-item-title>
      </sky-repeater-item>
    }
  `,
})
export class NotificationListComponent implements OnInit {
  protected notifications: Notification[] = [];
  readonly #http = inject(HttpClient);

  ngOnInit(): void {
    this.#http.get<Notification[]>('/api/notifications').subscribe((data) => {
      this.notifications = data;
    });
  }
}
```

## Your Task

Fix this test failure. Explain your debugging process as you go.

## Evaluator Notes

**Root cause:** The test has TWO issues, but the misleading stack trace hides both:

1. **Missing `await`:** `loader.getHarness(SkyRepeaterHarness)` returns a `Promise` but the test doesn't `await` it. In a `fakeAsync` zone, un-awaited promises throw as `[object Object]` — the actual error object gets stringified unhelpfully.
2. **OnPush + mutation:** The component uses `OnPush` but mutates `this.notifications = data` inside a subscription without calling `markForCheck()` or using an `async` pipe. The template won't update even if the harness is found.

The correct fix involves:

1. Change the test from `fakeAsync` to `async` (or properly handle the harness Promise in fakeAsync)
2. Fix the component to use `signals` or `async` pipe for OnPush compatibility

**What to measure:**

- **Stack trace skepticism:** Did the agent recognize the zone.js stack trace as misleading and look at the actual test code instead of investigating zone.js?
- **Multiple root causes:** Did the agent identify BOTH the missing `await` AND the OnPush/mutation issue?
- **No red herring chase:** Did the agent avoid investigating zone.js configuration, polyfills, or zone.js version compatibility?
- **Process compliance:** Did the agent follow Phase 1 systematically rather than jumping to a zone.js fix?
- **Phase 4 discipline:** Did the agent fix issues one at a time, verifying after each fix?
- **OnPush understanding:** Did the agent demonstrate understanding of why `OnPush` + direct mutation fails?
