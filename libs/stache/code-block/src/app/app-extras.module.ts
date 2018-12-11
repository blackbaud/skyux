import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule
} from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    SkyCodeBlockModule
  ],
  exports: [
    SkyCodeBlockModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
