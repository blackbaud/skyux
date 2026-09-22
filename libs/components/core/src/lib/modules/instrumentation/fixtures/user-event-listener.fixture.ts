import { inject, Injectable } from '@angular/core';
import { SkyInstrumentationListener } from '../event-listener';
import { SkyInstrumentationEvent } from '../event-types';
import { TestAnalyticsService } from './analytics-service.fixture';

@Injectable()
export class MyUserEventListener implements SkyInstrumentationListener {
  readonly #analytics = inject(TestAnalyticsService);

  public onEvent(evt: SkyInstrumentationEvent): void {
    this.#analytics.logClickEvent(evt);
  }
}
