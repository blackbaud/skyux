import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { provideSkyInstrumentationContextFrom } from './context-provider';
import { provideSkyInstrumentationListener } from './event-listener';

import { NestedContextHost, TestButtonHost } from './fixtures/context.fixture';
import { TestDynamicLauncherHost } from './fixtures/dynamic-component.fixture';
import { TestEventListener } from './fixtures/event-listener.fixture';

describe('instrumentation-context', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NestedContextHost, TestButtonHost, TestDynamicLauncherHost],
      providers: [provideSkyInstrumentationListener(TestEventListener)],
    });
  });

  it('should include the nearest context with a user event', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const listener = TestBed.inject(TestEventListener);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(listener.events).toEqual([
      {
        eventName: 'foo.bar',
        eventDetail: undefined,
        context: { name: 'products', detail: { productId: 'foo123' } },
      },
    ]);
  });

  it('should omit detail when no context in the chain provides it', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const listener = TestBed.inject(TestEventListener);

    fixture.componentInstance.context = { name: 'products' };
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(listener.events[0].context).toEqual({ name: 'products' });
  });

  it('should copy the context rather than share the bound object', () => {
    const fixture = TestBed.createComponent(TestButtonHost);
    const listener = TestBed.inject(TestEventListener);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(listener.events[0].context).not.toBe(
      fixture.componentInstance.context,
    );
  });

  it('should forward the context to a dynamically created component', () => {
    const fixture = TestBed.createComponent(TestDynamicLauncherHost);
    const listener = TestBed.inject(TestEventListener);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const formEl = document.querySelector('[data-sky-id="test-dynamic-form"]');
    const saveBtn = formEl?.querySelector<HTMLButtonElement>('button');

    saveBtn?.click();
    fixture.detectChanges();

    expect(listener.events).toEqual([
      {
        eventName: 'form.saved',
        eventDetail: { user: 'foo' },
        context: { name: 'products', detail: { productId: 'foo123' } },
      },
    ]);
  });

  it('should emit a user event from a dynamically created component that was not given the context', () => {
    const fixture = TestBed.createComponent(TestDynamicLauncherHost);
    const listener = TestBed.inject(TestEventListener);

    fixture.componentRef.setInput('forwardContext', false);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    const formEl = document.querySelector('[data-sky-id="test-dynamic-form"]');
    const saveBtn = formEl?.querySelector<HTMLButtonElement>('button');

    saveBtn?.click();
    fixture.detectChanges();

    expect(listener.events).toEqual([
      {
        eventName: 'form.saved',
        eventDetail: { user: 'foo' },
        context: undefined,
      },
    ]);
  });

  it('should use the nearest context name and merge detail from its ancestors', () => {
    const fixture = TestBed.createComponent(NestedContextHost);
    const listener = TestBed.inject(TestEventListener);

    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    fixture.detectChanges();

    expect(listener.events).toEqual([
      {
        eventName: 'foo.bar',
        eventDetail: undefined,
        context: {
          name: 'product-details',
          detail: { productId: 'foo123', recordId: 'bar456' },
        },
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
