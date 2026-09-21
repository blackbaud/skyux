import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  Type,
} from '@angular/core';
import { SkyInstrumentationUserEvent } from './user-event';

export abstract class SkyInstrumentationUserEventListener {
  public abstract onUserEvent(evt: SkyInstrumentationUserEvent): void;
}

export const SKY_USER_EVENT_LISTENERS = new InjectionToken<
  SkyInstrumentationUserEventListener[]
>('SKY_USER_EVENT_LISTENERS');

export function provideSkyInstrumentationUserEventListener(
  svc: Type<SkyInstrumentationUserEventListener>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: SKY_USER_EVENT_LISTENERS,
      useClass: svc,
      multi: true,
    },
  ]);
}
