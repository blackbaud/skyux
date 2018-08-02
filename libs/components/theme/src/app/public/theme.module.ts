import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './modules/style-loader';

require('style-loader!@skyux/theme/css/sky.css');

@NgModule({
  providers: [
    SkyAppStyleLoader
  ]
})
export class SkyThemeModule { }
