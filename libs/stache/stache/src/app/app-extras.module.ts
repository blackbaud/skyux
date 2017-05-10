import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import * as smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

import { StacheConfigService } from './shared/stache/modules/shared';
import { StacheTitleService } from './shared/stache/modules/wrapper/title.service';
import { StacheNavService } from './shared/stache/modules/nav/nav.service';
import { StacheWindowRef } from './shared/stache/modules/shared';

require('style-loader!prismjs/themes/prism.css');
require('style-loader!./app.scss');

// Specify entry components, module-level providers, etc. here.
@NgModule({
  providers: [
    {
      provide: StacheConfigService,
      useExisting: SkyAppConfig
    },
    StacheTitleService,
    StacheNavService,
    StacheWindowRef
  ]
})
export class AppExtrasModule { }
