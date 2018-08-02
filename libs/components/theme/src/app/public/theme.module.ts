import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './modules/style-loader';

// Switch these lines after initial release:
// require('style-loader!@skyux/theme/css/sky.css');
require('style-loader!@skyux/theme/src/app/public/styles/sky.scss');

@NgModule({
  providers: [
    SkyAppStyleLoader
  ]
})
export class SkyThemeModule { }
