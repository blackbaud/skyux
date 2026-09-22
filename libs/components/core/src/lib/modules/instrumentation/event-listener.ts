import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import type { SkyInstrumentationEvent } from './event-types';

export interface SkyInstrumentationListener {
  onEvent(evt: SkyInstrumentationEvent): void;
}

export const SKY_INSTRUMENTATION_LISTENERS = new InjectionToken<
  SkyInstrumentationListener[]
>('SKY_INSTRUMENTATION_LISTENERS');

export function provideSkyInstrumentationListener(
  listener: Type<SkyInstrumentationListener>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    listener,
    {
      provide: SKY_INSTRUMENTATION_LISTENERS,
      useExisting: listener,
      multi: true,
    },
  ]);
}
