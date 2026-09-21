import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import { SkyInstrumentationUserEvent } from './user-event';

export interface SkyInstrumentationUserEventListener {
  onUserEvent(evt: SkyInstrumentationUserEvent): void;
}

export const SKY_USER_EVENT_LISTENERS = new InjectionToken<
  SkyInstrumentationUserEventListener[]
>('SKY_USER_EVENT_LISTENERS');

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

export function notifyUserEventListeners(
  listeners: SkyInstrumentationUserEventListener[] | null,
  evt: SkyInstrumentationUserEvent,
): void {
  for (const listener of listeners ?? []) {
    listener.onUserEvent(evt);
  }
}
