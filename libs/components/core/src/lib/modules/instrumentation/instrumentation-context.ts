import {
  Directive,
  inject,
  Injector,
  input,
  StaticProvider,
} from '@angular/core';
import { SkyInstrumentationContextType } from './instrumentation-context-type';
import { SkyInstrumentationUserEventService } from './user-event-service';

@Directive({
  exportAs: 'skyInstrumentationContext',
  selector: '[skyInstrumentationContext]',
})
export class SkyInstrumentationContext {
  readonly #parentContext = inject(SkyInstrumentationContext, {
    optional: true,
    skipSelf: true,
  });

  readonly #userEventSvc = inject(SkyInstrumentationUserEventService);

  public readonly skyInstrumentationContext =
    input.required<SkyInstrumentationContextType>();

  public emitUserEvent(
    eventName: string,
    eventProperties?: Record<string, unknown>,
  ): void {
    this.#userEventSvc.notify({
      eventName,
      eventProperties,
      context: this.resolve(),
    });
  }

  public resolve(): SkyInstrumentationContextType {
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

// export const SKY_INSTRUMENTATION_CONTEXT =
//   new InjectionToken<SkyInstrumentationContextType>(
//     'SKY_INSTRUMENTATION_CONTEXT',
//   );

// export function provideSkyInstrumentationContext(
//   context: SkyInstrumentationContextType,
// ): Provider {
//   return {
//     provide: SKY_INSTRUMENTATION_CONTEXT,
//     useFactory: () => ({
//       ...inject(SKY_INSTRUMENTATION_CONTEXT, {
//         optional: true,
//         skipSelf: true,
//       }),
//       ...context,
//     }),
//   };
// }
