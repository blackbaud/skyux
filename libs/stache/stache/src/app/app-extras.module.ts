import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

/* start module hacks */

// We need to import these providers here because Builder automatically registers
// Stache's components. If we imported the StacheModule, each component would have two
// declared modules, which Angular does not allow.

import {
  StacheWindowRef,
  StacheRouteMetadataService,
  StacheConfigService,
  StacheJsonDataService
} from './public/src/modules/shared';

import { StacheTitleService } from './public/src/modules/wrapper/title.service';
import { StacheNavService } from './public/src/modules/nav/nav.service';
import { StacheAffixTopDirective } from './public/src/modules/affix/affix-top.directive';
import {
  StacheGoogleAnalyticsDirective
} from './public/src/modules/analytics/google-analytics.directive';

require('smoothscroll-polyfill').polyfill();
require('style-loader!prismjs/themes/prism.css');

/* end module hacks */

/* istanbul ignore next */
@NgModule({
  providers: [
    {
      provide: StacheConfigService,
      useExisting: SkyAppConfig
    },

    // These services would normally be provided in the StacheModule:
    StacheTitleService,
    StacheNavService,
    StacheJsonDataService,
    StacheWindowRef,
    StacheRouteMetadataService
  ],
  declarations: [
    StacheAffixTopDirective,
    StacheGoogleAnalyticsDirective
  ],
  exports: [
    StacheAffixTopDirective,
    StacheGoogleAnalyticsDirective
  ]
})
export class AppExtrasModule { }
