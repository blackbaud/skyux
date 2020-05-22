import {
  NgModule
} from '@angular/core';

import {
  SkyRestrictedViewModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyRestrictedViewModule
  ]
})
export class AppExtrasModule { }
