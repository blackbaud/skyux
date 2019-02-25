import { NgModule } from '@angular/core';

import { BBHelpModule } from './public';

import { SkyModalDemoFormComponent, HelpWindowRef } from './lib';

// Specify entry components, module-level providers, etc. here.
import {
  AppSkyModule
} from './app-sky.module';

@NgModule({
  imports: [
    BBHelpModule
  ],
  exports: [
    AppSkyModule,
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
