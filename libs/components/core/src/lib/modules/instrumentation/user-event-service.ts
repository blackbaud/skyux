import { inject, Injectable } from '@angular/core';
import { SkyInstrumentationUserEvent } from './user-event';
import { SKY_USER_EVENT_LISTENERS } from './user-event-listener';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class _SkyInstrumentationUserEventService {
  readonly #listeners = inject(SKY_USER_EVENT_LISTENERS, { optional: true });

  public notify(evt: SkyInstrumentationUserEvent): void {
    for (const listener of this.#listeners ?? []) {
      listener.onUserEvent(evt);
    }
  }
}
