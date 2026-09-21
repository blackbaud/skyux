import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import { SkyInstrumentationUserEvent } from './user-event';

/**
 * Receives the user events emitted by SKY UX components.
 */
export interface SkyInstrumentationUserEventListener {
  /**
   * Called each time a SKY UX component emits a user event.
   */
  onUserEvent(evt: SkyInstrumentationUserEvent): void;
}

export const SKY_USER_EVENT_LISTENERS = new InjectionToken<
  SkyInstrumentationUserEventListener[]
>('SKY_USER_EVENT_LISTENERS');

/**
 * Registers a listener to receive the user events emitted by SKY UX components.
 * Register listeners in the application's root providers; listeners registered
 * on a lazy-loaded route are not visible to components rendered in a modal,
 * flyout, or other overlay.
 * @param listener The listener to instantiate and register.
 */
export function provideSkyInstrumentationUserEventListener(
  listener: Type<SkyInstrumentationUserEventListener>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    listener,
    {
      provide: SKY_USER_EVENT_LISTENERS,
      useExisting: listener,
      multi: true,
    },
  ]);
}
