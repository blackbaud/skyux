import { inject } from '@angular/core';

import { SkyInstrumentationContext } from './instrumentation-context';
import {
  notifyUserEventListeners,
  SKY_USER_EVENT_LISTENERS,
} from './user-event-listener';

export class SkyInstrumentationUserEventEmitter {
  readonly #context = inject(SkyInstrumentationContext, { optional: true });
  readonly #listeners = inject(SKY_USER_EVENT_LISTENERS, { optional: true });

  public emit(
    eventName: string,
    eventProperties?: Record<string, unknown>,
  ): void {
    notifyUserEventListeners(this.#listeners, {
      eventName,
      eventProperties,
      context: this.#context?.resolve(),
    });
  }
}

export function createSkyInstrumentationUserEventEmitter(): SkyInstrumentationUserEventEmitter {
  return new SkyInstrumentationUserEventEmitter();
}
