import { TestBed } from '@angular/core/testing';

import { provideSkyInstrumentationUserEventListener } from './user-event-listener';

import { TestAnalyticsService } from './fixtures/analytics-service';
import { TestModalLauncherHost } from './fixtures/modal-test.fixture';
import { MyUserEventListener } from './fixtures/user-event-listener';
import { TestButtonHost } from './fixtures/user-event-test.fixture';

describe('instrumentation-context', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost, TestModalLauncherHost],
      providers: [
        provideSkyInstrumentationUserEventListener(MyUserEventListener),
      ],
    });
  });

  it('should', () => {
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

  it('should', () => {
    const fixture = TestBed.createComponent(TestModalLauncherHost);
    const svc = TestBed.inject(TestAnalyticsService);

    const spy = spyOn(svc, 'logClickEvent');

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const modalEl = document.querySelector('[data-sky-id="test-modal"]');
    const saveBtn = modalEl?.querySelector<HTMLButtonElement>(
      'button.sky-btn-primary',
    );

    saveBtn?.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      eventName: 'modal.saved',
      eventProperties: { user: 'foo' },
      context: { productId: 'foo123' },
    });
  });
});
