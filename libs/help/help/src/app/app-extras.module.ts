import { NgModule } from '@angular/core';

import { BBHelpModule } from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    BBHelpModule
  ],
  exports: [
    BBHelpModule
  ],
  providers: [],
  entryComponents: []
})
export class AppExtrasModule { }
