import {
  NgModule
} from '@angular/core';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  SkyAppAssetsService
} from '@skyux/assets';

import {
  SkyLibResourcesPipe
} from './lib-resources.pipe';

import {
  SkyLibResourcesService
} from './lib-resources.service';

import {
  SkyAppLocaleProvider
} from './locale-provider';

import {
  SkyAppResourcesPipe
} from './resources.pipe';

import {
  SkyAppResourcesService
} from './resources.service';

@NgModule({
  declarations: [
    SkyAppResourcesPipe,
    SkyLibResourcesPipe
  ],
  exports: [
    SkyAppResourcesPipe,
    SkyLibResourcesPipe
  ],
  imports: [
    HttpClientModule
  ],
  providers: [
    // This service is ultimately provided by Builder,
    // but we need to add it to a module to avoid TSLint failures.
    {
      provide: SkyAppAssetsService,
      useValue: SkyAppAssetsService
    },
    SkyAppLocaleProvider,
    SkyAppResourcesService,
    SkyLibResourcesService
  ]
})
export class SkyI18nModule { }
