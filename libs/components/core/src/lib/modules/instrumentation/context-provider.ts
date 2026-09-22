import { Injector, StaticProvider } from '@angular/core';
import { SKY_INSTRUMENTATION_CONTEXT } from './context-resolver';

export function provideSkyInstrumentationContextFrom(
  injector: Injector,
): StaticProvider[] {
  const context = injector.get(SKY_INSTRUMENTATION_CONTEXT, null);

  return context
    ? [{ provide: SKY_INSTRUMENTATION_CONTEXT, useValue: context }]
    : [];
}
