import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyHelpService } from '@skyux/core';

import { SkyHelpTestingController } from './help-testing-controller';
import { SkyHelpTestingService } from './help-testing.service';

/**
 * Mocks SkyHelpService to enable testing of global help.
 */
@NgModule({
  providers: [
    {
      provide: SkyHelpService,
      useClass: SkyHelpTestingService,
    },
    SkyHelpTestingController,
  ],
  exports: [NoopAnimationsModule],
})
export class SkyHelpTestingModule {}
