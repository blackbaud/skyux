import { SkyInstrumentationUserEvent } from '@skyux/core';

export abstract class SkyInstrumentationUserEventTestController {
  public abstract expectUserEvent(evt: SkyInstrumentationUserEvent): void;
  public abstract expectUserEventCount(
    evt: SkyInstrumentationUserEvent,
    count: number,
  ): void;
}
