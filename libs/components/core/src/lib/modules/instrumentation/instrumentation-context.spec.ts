import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideSkyInstrumentationContextFrom } from './instrumentation-context';
import { provideSkyInstrumentationUserEventListener } from './user-event-listener';

import { TestAnalyticsService } from './fixtures/analytics-service.fixture';
import { TestDynamicLauncherHost } from './fixtures/dynamic-component-test.fixture';
import { NestedContextTest } from './fixtures/nested-context.fixture';
import { MyUserEventListener } from './fixtures/user-event-listener.fixture';
import { TestButtonHost } from './fixtures/user-event-test.fixture';

describe('instrumentation-context', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NestedContextTest, TestButtonHost, TestDynamicLauncherHost],
      providers: [
        provideSkyInstrumentationUserEventListener(MyUserEventListener),
      ],
    });
  });

  it('should include the nearest context with a user event', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const svc = TestBed.inject(TestAnalyticsService);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(svc.clickEvents).toEqual([
      {
        eventName: 'foo.bar',
        eventProperties: undefined,
        context: { productId: 'foo123' },
      },
    ]);
  });

  it('should copy the context rather than share the bound object', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const svc = TestBed.inject(TestAnalyticsService);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(svc.clickEvents[0].context).not.toBe(
      fixture.componentInstance.context,
    );
  });

  it('should forward the context to a dynamically created component', () => {
    const fixture = TestBed.createComponent(TestDynamicLauncherHost);
    const svc = TestBed.inject(TestAnalyticsService);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const formEl = document.querySelector('[data-sky-id="test-dynamic-form"]');
    const saveBtn = formEl?.querySelector<HTMLButtonElement>('button');

    saveBtn?.click();
    fixture.detectChanges();

    expect(svc.clickEvents).toEqual([
      {
        eventName: 'form.saved',
        eventProperties: { user: 'foo' },
        context: { productId: 'foo123' },
      },
    ]);
  });

  it('should emit a user event from a dynamically created component that was not given the context', () => {
    const fixture = TestBed.createComponent(TestDynamicLauncherHost);
    const svc = TestBed.inject(TestAnalyticsService);

    fixture.componentRef.setInput('forwardContext', false);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const formEl = document.querySelector('[data-sky-id="test-dynamic-form"]');
    const saveBtn = formEl?.querySelector<HTMLButtonElement>('button');

    saveBtn?.click();
    fixture.detectChanges();

    expect(svc.clickEvents).toEqual([
      {
        eventName: 'form.saved',
        eventProperties: { user: 'foo' },
        context: undefined,
      },
    ]);
  });

  it('should merge a nested context with its parent', () => {
    const fixture = TestBed.createComponent(NestedContextTest);
    const svc = TestBed.inject(TestAnalyticsService);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(svc.clickEvents).toEqual([
      {
        eventName: 'foo.bar',
        eventProperties: undefined,
        context: { productId: 'foo123', recordId: 'bar456' },
      },
    ]);
  });

  it('should provide nothing when an injector has no context', () => {
    expect(
      provideSkyInstrumentationContextFrom(TestBed.inject(Injector)),
    ).toEqual([]);
  });
});

describe('instrumentation-context without a listener', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestButtonHost] });
  });

  it('should emit a user event without error', () => {
    const fixture = TestBed.createComponent(TestButtonHost);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');

    expect(() => btn.click()).not.toThrow();
  });
});
