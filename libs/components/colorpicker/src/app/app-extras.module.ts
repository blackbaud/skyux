import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyColorpickerModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyColorpickerModule
  ]
})
export class AppExtrasModule { }
