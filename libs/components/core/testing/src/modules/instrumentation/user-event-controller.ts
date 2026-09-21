import { Injectable } from '@angular/core';
import { SkyInstrumentationUserEvent } from '@skyux/core';

@Injectable()
export abstract class SkyInstrumentationUserEventTestController {
  public abstract expectUserEvent(evt: SkyInstrumentationUserEvent): void;
  public abstract expectUserEventCount(
    evt: SkyInstrumentationUserEvent,
    count: number,
  ): void;
}
