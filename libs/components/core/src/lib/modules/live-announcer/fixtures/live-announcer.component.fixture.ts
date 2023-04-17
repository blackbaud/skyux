import { Component } from '@angular/core';

import { SkyLiveAnnouncerService } from '../live-announcer.service';

@Component({
  templateUrl: `./live-announcer.component.fixture.html`,
})
export class SkyLiveAnnouncerFixtureComponent {
  constructor(public liveAnnouncerSvc: SkyLiveAnnouncerService) {}

  public announceText(message: string): void {
    this.liveAnnouncerSvc.announce(message);
  }
}
