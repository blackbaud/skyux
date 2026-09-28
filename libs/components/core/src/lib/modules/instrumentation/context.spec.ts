import { ErrorHandler, Injector, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideSkyInstrumentationContextFrom } from './context-provider';
import { provideSkyInstrumentationListener } from './event-listener';

import { NestedContextHost, TestButtonHost } from './fixtures/context.fixture';
import { TestDynamicLauncherHost } from './fixtures/dynamic-component.fixture';
import {
  TestEventListener,
  ThrowingEventListener,
} from './fixtures/event-listener.fixture';

function setupTest<T>(component: Type<T>): {
  fixture: ComponentFixture<T>;
  listener: TestEventListener;
} {
  return {
    fixture: TestBed.createComponent(component),
    listener: TestBed.inject(TestEventListener),
  };
}

function clickButton(fixture: ComponentFixture<unknown>): void {
  fixture.detectChanges();

  (fixture.nativeElement as HTMLElement)
    .querySelector<HTMLButtonElement>('button')
    ?.click();

  fixture.detectChanges();
}

function saveDynamicForm(
  fixture: ComponentFixture<TestDynamicLauncherHost>,
): void {
  clickButton(fixture);

  const formEl = document.querySelector('[data-sky-id="test-dynamic-form"]');

  formEl?.querySelector<HTMLButtonElement>('button')?.click();

  fixture.detectChanges();
}

describe('instrumentation-context', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NestedContextHost, TestButtonHost, TestDynamicLauncherHost],
      providers: [provideSkyInstrumentationListener(TestEventListener)],
    });
  });

  it('should include the nearest context with a user event', () => {
    const { fixture, listener } = setupTest(TestButtonHost);

    clickButton(fixture);

    expect(listener.events).toEqual([
      {
        eventName: 'foo.bar',
        eventDetail: undefined,
        context: { name: 'products', detail: { productId: 'foo123' } },
      },
    ]);
  });

  it('should omit detail when no context in the chain provides it', () => {
    const { fixture, listener } = setupTest(TestButtonHost);

    fixture.componentInstance.context = { name: 'products' };

    clickButton(fixture);

    expect(listener.events[0].context).toEqual({ name: 'products' });
  });

  it('should copy the context rather than share the bound object', () => {
    const { fixture, listener } = setupTest(TestButtonHost);

    clickButton(fixture);

    const { context } = fixture.componentInstance;

    expect(listener.events[0].context).not.toBe(context);
    expect(listener.events[0].context?.detail).not.toBe(context.detail);
  });

  it('should forward the context to a dynamically created component', () => {
    const { fixture, listener } = setupTest(TestDynamicLauncherHost);

    saveDynamicForm(fixture);

    expect(listener.events).toEqual([
      {
        eventName: 'form.saved',
        eventDetail: { user: 'foo' },
        context: { name: 'products', detail: { productId: 'foo123' } },
      },
    ]);
  });

  it('should emit a user event from a dynamically created component that was not given the context', () => {
    const { fixture, listener } = setupTest(TestDynamicLauncherHost);

    fixture.componentRef.setInput('forwardContext', false);

    saveDynamicForm(fixture);

    expect(listener.events).toEqual([
      {
        eventName: 'form.saved',
        eventDetail: { user: 'foo' },
        context: undefined,
      },
    ]);
  });

  it('should reference each enclosing context as the parent of the one below it', () => {
    const { fixture, listener } = setupTest(NestedContextHost);

    clickButton(fixture);

    expect(listener.events).toEqual([
      {
        eventName: 'foo.bar',
        eventDetail: undefined,
        context: {
          name: 'notes',
          parent: {
            name: 'product-details',
            detail: { recordId: 'bar456' },
            parent: { name: 'products', detail: { productId: 'foo123' } },
          },
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

    expect(() => clickButton(fixture)).not.toThrow();
  });
});

describe('instrumentation-context with a listener that throws', () => {
  it('should report the failure and notify the remaining listeners', () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHost],
      providers: [
        provideSkyInstrumentationListener(ThrowingEventListener),
        provideSkyInstrumentationListener(TestEventListener),
      ],
    });

    const handleError = spyOn(TestBed.inject(ErrorHandler), 'handleError');
    const { fixture, listener } = setupTest(TestButtonHost);

    expect(() => clickButton(fixture)).not.toThrow();

    expect(handleError).toHaveBeenCalledWith(new Error('Listener failed.'));
    expect(listener.events.length).toEqual(1);
  });
});
