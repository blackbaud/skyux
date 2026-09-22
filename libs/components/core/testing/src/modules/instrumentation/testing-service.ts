import { Injectable } from '@angular/core';
import {
  SkyInstrumentationEvent,
  SkyInstrumentationListener,
} from '@skyux/core';

@Injectable()
export class SkyInstrumentationTestingService implements SkyInstrumentationListener {
  readonly #notifications: string[] = [];

  public handleEvent(evt: SkyInstrumentationEvent): void {
    this.#notifications.push(this.#serialize(evt));
  }

  public expectEvent(evt: SkyInstrumentationEvent): void {
    const serialized = this.#serialize(evt);

    if (!this.#notifications.includes(serialized)) {
      throw new Error(`Expected an event to be logged with ${serialized}.`);
    }
  }

  public expectEventCount(
    evt: SkyInstrumentationEvent,
    expectedCount: number,
  ): void {
    const serialized = this.#serialize(evt);
    const actualCount = this.#notifications.filter(
      (n) => n === serialized,
    ).length;

    if (actualCount !== expectedCount) {
      throw new Error(
        `Expected an event ${serialized} to be logged ${expectedCount} time(s), but it was logged ${actualCount} time(s).`,
      );
    }
  }

  #serialize(evt: SkyInstrumentationEvent): string {
    return JSON.stringify(evt, (_key, value: unknown) =>
      value && typeof value === 'object' && !Array.isArray(value)
        ? Object.fromEntries(
            Object.entries(value).sort(([a], [b]) => (a < b ? -1 : 1)),
          )
        : value,
    );
  }
}
