import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyNavbarModule
} from './public';

@NgModule({
  exports: [
    SkyNavbarModule,
    SkyDropdownModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
