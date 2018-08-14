import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './style-loader';

import {
  SkyAppViewportService
} from './viewport.service';

// Automatically insert the global stylesheet for consumers of this module:
require('style-loader!@skyux/theme/css/sky.css');

@NgModule({
  providers: [
    SkyAppStyleLoader,
    SkyAppViewportService
  ]
})
export class SkyThemeModule { }
