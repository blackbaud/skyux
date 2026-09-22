import { Injectable } from '@angular/core';
import {
  SkyInstrumentationEvent,
  SkyInstrumentationListener,
} from '@skyux/core';

@Injectable()
export class MyInstrumentationListener implements SkyInstrumentationListener {
  public onEvent(evt: SkyInstrumentationEvent): void {
    console.log('Instrumentation event:', evt);
  }
}
