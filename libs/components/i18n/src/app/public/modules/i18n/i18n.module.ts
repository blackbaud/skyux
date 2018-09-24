import {
  NgModule
} from '@angular/core';

import {
  HttpModule
} from '@angular/http';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyAppHostLocaleProvider
} from './host-locale-provider';

import {
  SkyAppResourcesPipe
} from './resources.pipe';

import {
  SkyAppResourcesService
} from './resources.service';

@NgModule({
  declarations: [
    SkyAppResourcesPipe
  ],
  exports: [
    SkyAppResourcesPipe
  ],
  imports: [
    HttpModule
  ],
  providers: [
    // This service is ultimately provided by Builder,
    // but we need to add it to a module to avoid TSLint failures.
    {
      provide: SkyAppAssetsService,
      useValue: SkyAppAssetsService
    },
    SkyAppHostLocaleProvider,
    SkyAppResourcesService,
    SkyAppWindowRef
  ]
})
export class SkyI18nModule { }
