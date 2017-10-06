import { NgModule } from '@angular/core';

import { BBHelpModule } from './public';

import { SkyModalDemoFormComponent, HelpWindowRef } from './libs';

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
  entryComponents: [
    SkyModalDemoFormComponent
  ]
})
export class AppExtrasModule { }
