import { inject, Injectable } from '@angular/core';
import { SkyInstrumentationUserEvent } from '../user-event';
import { SkyInstrumentationUserEventListener } from '../user-event-listener';
import { TestAnalyticsService } from './analytics-service';

@Injectable()
export class MyUserEventListener extends SkyInstrumentationUserEventListener {
  readonly #analytics = inject(TestAnalyticsService);

  public onUserEvent(evt: SkyInstrumentationUserEvent): void {
    this.#analytics.logClickEvent(evt);
  }
}
