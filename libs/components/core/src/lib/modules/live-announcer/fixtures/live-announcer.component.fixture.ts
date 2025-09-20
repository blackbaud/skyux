import { Component, inject } from '@angular/core';

import { SkyLiveAnnouncerService } from '../live-announcer.service';

@Component({
  templateUrl: `./live-announcer.component.fixture.html`,
  standalone: false,
})
export class SkyLiveAnnouncerFixtureComponent {
  #liveAnnouncerSvc = inject(SkyLiveAnnouncerService);

  public announceText(message: string): void {
    this.#liveAnnouncerSvc.announce(message);
  }
}
