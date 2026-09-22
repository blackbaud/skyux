import { Injectable } from '@angular/core';
import { SkyInstrumentationUserEvent } from '../event-types';

@Injectable({
  providedIn: 'root',
})
export class TestAnalyticsService {
  public readonly clickEvents: SkyInstrumentationUserEvent[] = [];

  public logClickEvent(evt: SkyInstrumentationUserEvent): void {
    this.clickEvents.push(evt);
  }
}
