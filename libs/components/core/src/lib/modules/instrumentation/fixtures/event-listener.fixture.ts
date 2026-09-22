import { Injectable } from '@angular/core';

import { SkyInstrumentationListener } from '../event-listener';
import { SkyInstrumentationEvent } from '../event-types';

@Injectable()
export class TestEventListener implements SkyInstrumentationListener {
  public readonly events: SkyInstrumentationEvent[] = [];

  public onEvent(evt: SkyInstrumentationEvent): void {
    this.events.push(evt);
  }
}
