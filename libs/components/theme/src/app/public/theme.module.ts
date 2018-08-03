import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './modules/style-loader';

// Automatically insert the global stylesheet for consumers of this module:
require('style-loader!@skyux/theme/css/sky.css');

@NgModule({
  providers: [
    SkyAppStyleLoader
  ]
})
export class SkyThemeModule { }
