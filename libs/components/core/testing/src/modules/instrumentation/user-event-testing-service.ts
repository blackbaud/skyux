import { Injectable } from '@angular/core';
import { SkyInstrumentationUserEvent } from '@skyux/core';

@Injectable()
export class SkyInstrumentationUserEventTestingService {
  readonly #notifications: string[] = [];

  public notify(evt: SkyInstrumentationUserEvent): void {
    this.#notifications.push(this.#serialize(evt));
  }

  public expectUserEvent(evt: SkyInstrumentationUserEvent): void {
    const serialized = this.#serialize(evt);

    if (!this.#notifications.includes(serialized)) {
      throw new Error(`Expected a user event to be logged with ${serialized}.`);
    }
  }

  public expectUserEventCount(
    evt: SkyInstrumentationUserEvent,
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

  #serialize(evt: SkyInstrumentationUserEvent): string {
    return JSON.stringify(evt);
  }
}
