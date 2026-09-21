import { inject, Injectable } from '@angular/core';

import { SkyInstrumentationContext } from './instrumentation-context';
import { SkyInstrumentationUserEventService } from './user-event-service';

@Injectable()
export class SkyInstrumentationUserEventEmitter {
  readonly #context = inject(SkyInstrumentationContext, { optional: true });
  readonly #evtSvc = inject(SkyInstrumentationUserEventService);

  public emit(
    eventName: string,
    eventProperties?: Record<string, unknown>,
  ): void {
    this.#evtSvc.notify({
      eventName,
      eventProperties,
      context: this.#context?.resolve(),
    });
  }
}

export function createSkyInstrumentationUserEventEmitter(): SkyInstrumentationUserEventEmitter {
  return new SkyInstrumentationUserEventEmitter();
}
