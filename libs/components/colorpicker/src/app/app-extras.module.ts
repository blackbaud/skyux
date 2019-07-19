import {
  NgModule
} from '@angular/core';

import {
  SkyAppLinkModule
} from '@skyux/router';

import {
  SkyColorpickerModule
} from './public';

@NgModule({
  exports: [
    SkyAppLinkModule,
    SkyColorpickerModule
  ]
})
export class AppExtrasModule { }
