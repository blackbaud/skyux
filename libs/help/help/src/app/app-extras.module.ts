import { NgModule } from '@angular/core';

import { SkyAppConfig } from '@blackbaud/skyux-builder/runtime';

import { LibraryModule, LibraryConfigService } from './public';

// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [
    LibraryModule
  ],
  exports: [
    LibraryModule
  ],
  providers: [
    // The config service acts as an adaptor for skyuxconfig.json:
    {
      provide: LibraryConfigService,
      useExisting: SkyAppConfig
    }
  ],
  entryComponents: []
})
export class AppExtrasModule { }
