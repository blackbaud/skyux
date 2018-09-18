import {
  NgModule
} from '@angular/core';

import {
  HttpModule
} from '@angular/http';

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
  providers: [
    HttpModule,
    SkyAppHostLocaleProvider,
    SkyAppResourcesService
  ]
})
export class SkyI18nModule { }
