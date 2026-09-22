import { Injector, StaticProvider } from '@angular/core';
import { SKY_INSTRUMENTATION_CONTEXT } from './context-resolver';

/**
 * Forwards the instrumentation context resolved from the given injector to a
 * dynamically created component, such as a modal or flyout, which would
 * otherwise render outside of the launching element.
 */
export function provideSkyInstrumentationContextFrom(
  injector: Injector,
): StaticProvider[] {
  const context = injector.get(SKY_INSTRUMENTATION_CONTEXT, null);

  return context
    ? [{ provide: SKY_INSTRUMENTATION_CONTEXT, useValue: context }]
    : [];
}
