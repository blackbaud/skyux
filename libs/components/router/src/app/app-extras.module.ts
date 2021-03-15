import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule
  ]
})
export class AppExtrasModule { }
