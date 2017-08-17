import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import { BBHelpModule, BBHelpConfigService } from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    BBHelpModule
  ],
  exports: [
    BBHelpModule
  ],
  providers: [
    // The config service acts as an adaptor for skyuxconfig.json:
    {
      provide: BBHelpConfigService,
      useExisting: SkyAppConfig
    }
  ],
  entryComponents: []
})
export class AppExtrasModule { }
