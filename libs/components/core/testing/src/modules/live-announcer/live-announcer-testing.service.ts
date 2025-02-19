import { Injectable } from '@angular/core';
import { SkyLiveAnnouncerArgs, SkyLiveAnnouncerService } from '@skyux/core';

@Injectable()
export class SkyLiveAnnouncerTestingService extends SkyLiveAnnouncerService {
  public override announce(message: string, args?: SkyLiveAnnouncerArgs): void {
    console.error(`Live announcer message: ${message}`);

    if (args) {
      console.error(`Message config: ${args}`);
    }
  }
}
