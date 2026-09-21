import {
  Directive,
  inject,
  Injector,
  input,
  StaticProvider,
} from '@angular/core';
import {
  notifyUserEventListeners,
  SKY_USER_EVENT_LISTENERS,
} from './user-event-listener';

@Directive({
  exportAs: 'skyInstrumentationContext',
  selector: '[skyInstrumentationContext]',
})
export class SkyInstrumentationContext {
  readonly #listeners = inject(SKY_USER_EVENT_LISTENERS, { optional: true });
  readonly #parentContext = inject(SkyInstrumentationContext, {
    optional: true,
    skipSelf: true,
  });

  public readonly skyInstrumentationContext =
    input.required<Record<string, unknown>>();

  public emitUserEvent(
    eventName: string,
    eventProperties?: Record<string, unknown>,
  ): void {
    notifyUserEventListeners(this.#listeners, {
      eventName,
      eventProperties,
      context: this.resolve(),
    });
  }

  public resolve(): Record<string, unknown> {
    if (this.#parentContext?.skyInstrumentationContext()) {
      return {
        ...this.#parentContext?.resolve(),
        ...this.skyInstrumentationContext(),
      };
    }

    return this.skyInstrumentationContext();
  }
}

/**
 * Forwards the nearest instrumentation context to a component created outside of
 * the current view, such as a modal or flyout, whose injector cannot reach it.
 */
export function provideSkyInstrumentationContextFrom(
  injector: Injector,
): StaticProvider[] {
  const context = injector.get(SkyInstrumentationContext, null);

  return context
    ? [{ provide: SkyInstrumentationContext, useValue: context }]
    : [];
}
