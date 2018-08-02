import {
  NgModule
} from '@angular/core';

import {
  SkyAppStyleLoader
} from './modules/style-loader';

// Automatically insert the global stylesheet for consumers of this module:

// (Switch these lines after initial release.)
// require('style-loader!@skyux/theme/css/sky.css');
require('style-loader!@skyux/theme/src/app/public/styles/sky.scss');

@NgModule({
  providers: [
    SkyAppStyleLoader
  ]
})
export class SkyThemeModule { }
