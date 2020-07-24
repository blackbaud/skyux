import {
  NgModule
} from '@angular/core';

import {
  SkyCardModule,
  SkyToolbarModule
} from '@skyux/layout';

import {
  SkyRepeaterModule
} from '@skyux/lists';

import {
  SkyThemeService
} from '@skyux/theme';

import {
  SkyDataManagerModule
} from '../data-manager.module';

import {
  SkyDataManagerService
} from '../data-manager.service';

@NgModule({
  imports: [
    SkyCardModule,
    SkyDataManagerModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  exports: [
    SkyCardModule,
    SkyDataManagerModule,
    SkyRepeaterModule,
    SkyToolbarModule
  ],
  providers: [
    SkyDataManagerService,
    SkyThemeService
  ]
})
export class DataManagerFixtureModule { }
