import {
  NgModule
} from '@angular/core';

import {
  SkyDropdownModule,
  SkyPopoverModule
} from './public';

@NgModule({
  imports: [
    SkyDropdownModule,
    SkyPopoverModule
  ],
  exports: [
    SkyDropdownModule,
    SkyPopoverModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
