import { Injectable } from '@angular/core';
import { SkyInstrumentationEvent } from '../event-types';

@Injectable({
  providedIn: 'root',
})
export class TestAnalyticsService {
  public readonly clickEvents: SkyInstrumentationEvent[] = [];

  public logClickEvent(evt: SkyInstrumentationEvent): void {
    this.clickEvents.push(evt);
  }
}
