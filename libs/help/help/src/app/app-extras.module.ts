import {
  NgModule
} from '@angular/core';

import {
  BBHelpModule,
  HelpInitializationService
} from './public/public_api';

import {
  SkyModalDemoFormComponent,
  HelpWindowRef
} from './lib';

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
    HelpWindowRef,
    HelpInitializationService
  ],
  entryComponents: [
    SkyModalDemoFormComponent
  ]
})
export class AppExtrasModule { }
