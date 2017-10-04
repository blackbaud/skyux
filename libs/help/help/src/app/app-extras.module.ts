import { NgModule } from '@angular/core';

import { BBHelpModule } from './public';

import { HelpWindowRef } from './libs/window-ref/window-ref';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    BBHelpModule
  ],
  exports: [
    BBHelpModule
  ],
  providers: [
    HelpWindowRef
  ],
  entryComponents: []
})
export class AppExtrasModule { }
