import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import type { SkyInstrumentationEvent } from './event-types';

/**
 * Receives the instrumentation events emitted by SKY UX components.
 */
export interface SkyInstrumentationListener {
  /**
   * Called once for each event, in the order the events are emitted.
   */
  onEvent(evt: SkyInstrumentationEvent): void;
}

/**
 * @internal
 */
export const SKY_INSTRUMENTATION_LISTENERS = new InjectionToken<
  SkyInstrumentationListener[]
>('SKY_INSTRUMENTATION_LISTENERS');

/**
 * Registers a listener to receive instrumentation events. Provide this in your
 * application config so that components in lazy-loaded routes can reach the
 * listener.
 */
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
