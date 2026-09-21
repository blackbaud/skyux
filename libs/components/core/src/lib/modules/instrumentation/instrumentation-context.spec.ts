import { TestBed } from '@angular/core/testing';

import { provideSkyInstrumentationUserEventListener } from './user-event-listener';

import { TestAnalyticsService } from './fixtures/analytics-service';
import { TestDynamicLauncherHost } from './fixtures/dynamic-component-test.fixture';
import { MyUserEventListener } from './fixtures/user-event-listener';
import { TestButtonHost } from './fixtures/user-event-test.fixture';

describe('instrumentation-context', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost, TestDynamicLauncherHost],
      providers: [
        provideSkyInstrumentationUserEventListener(MyUserEventListener),
      ],
    });
  });

  it('should include the nearest context with a user event', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const svc = TestBed.inject(TestAnalyticsService);

    const spy = spyOn(svc, 'logClickEvent');

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      eventName: 'foo.bar',
      eventProperties: undefined,
      context: { productId: 'foo123' },
    });
  });

  it('should forward the context to a dynamically created component', () => {
    const fixture = TestBed.createComponent(TestDynamicLauncherHost);
    const svc = TestBed.inject(TestAnalyticsService);

    const spy = spyOn(svc, 'logClickEvent');

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const formEl = document.querySelector('[data-sky-id="test-dynamic-form"]');
    const saveBtn = formEl?.querySelector<HTMLButtonElement>('button');

    saveBtn?.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      eventName: 'form.saved',
      eventProperties: { user: 'foo' },
      context: { productId: 'foo123' },
    });
  });
});
