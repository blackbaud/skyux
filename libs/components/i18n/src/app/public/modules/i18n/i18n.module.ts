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
  SkyAppResourcesPipe
} from './resources.pipe';

import {
  SkyAppResourcesService
} from './resources.service';

import {
  SkyLibResourcesPipe
} from './lib-resources.pipe';

import {
  SkyLibResourcesService
} from './lib-resources.service';

import {
  SkyAppLocaleProvider
} from './locale-provider';

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
    HttpModule
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
    SkyAppWindowRef,
    SkyLibResourcesService
  ]
})
export class SkyI18nModule { }
