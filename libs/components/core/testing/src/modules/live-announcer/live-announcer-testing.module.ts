import { NgModule } from '@angular/core';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { SkyLiveAnnouncerTestingService } from './live-announcer-testing.service';

@NgModule({
  providers: [
    {
      provide: SkyLiveAnnouncerService,
      useClass: SkyLiveAnnouncerTestingService,
    },
  ],
})
export class SkyLiveAnnouncerTestingModule {}
