import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [],
  exports: [
    SkyCodeBlockModule,
    SkyCodeModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
