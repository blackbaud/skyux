import { NgModule } from '@angular/core';
import { SkyHelpService } from '@skyux/core';

import { SkyHelpTestingController } from './help-testing-controller';
import { SkyHelpTestingService } from './help-testing.service';

/**
 * Mocks SkyHelpService to enable testing of global help.
 * @docsIncludeIds SkyHelpTestingController
 */
@NgModule({
  providers: [
    {
      provide: SkyHelpService,
      useClass: SkyHelpTestingService,
    },
    SkyHelpTestingController,
  ],
})
export class SkyHelpTestingModule {}
