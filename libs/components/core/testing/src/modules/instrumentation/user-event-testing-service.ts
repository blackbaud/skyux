import { Injectable } from '@angular/core';
import {
  SkyInstrumentationEvent,
  SkyInstrumentationListener,
  SkyInstrumentationUserEvent,
} from '@skyux/core';

type ExpectedUserEvent = Omit<SkyInstrumentationUserEvent, 'eventType'>;

@Injectable()
export class SkyInstrumentationUserEventTestingService implements SkyInstrumentationListener {
  readonly #notifications: string[] = [];

  public onEvent(evt: SkyInstrumentationEvent): void {
    if (evt.eventType === 'user') {
      this.#notifications.push(this.#serialize(evt));
    }
  }

  public expectUserEvent(evt: ExpectedUserEvent): void {
    const serialized = this.#serialize(evt);

    if (!this.#notifications.includes(serialized)) {
      throw new Error(`Expected a user event to be logged with ${serialized}.`);
    }
  }

  public expectUserEventCount(
    evt: ExpectedUserEvent,
    expectedCount: number,
  ): void {
    const serialized = this.#serialize(evt);
    const actualCount = this.#notifications.filter(
      (n) => n === serialized,
    ).length;

    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected a user event ${serialized} to be logged ${expectedCount} time(s), but it was logged ${actualCount} time(s).`,
      );
    }
  }

  #serialize(evt: ExpectedUserEvent): string {
    return JSON.stringify(
      { ...evt, eventType: 'user' },
      (_key, value: unknown) =>
        value && typeof value === 'object' && !Array.isArray(value)
          ? Object.fromEntries(
              Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)),
            )
          : value,
    );
  }
}
