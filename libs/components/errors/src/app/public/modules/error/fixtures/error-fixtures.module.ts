import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyLibResourcesTestService
} from '@skyux/i18n/testing';

import {
  SkyErrorModule
} from '../';
import {
  ErrorTestComponent
} from './error.component.fixture';

@NgModule({
  declarations: [
    ErrorTestComponent
  ],
  imports: [
    CommonModule,
    SkyErrorModule
  ],
  exports: [
    ErrorTestComponent
  ],
  providers: [
    {
      provide: SkyLibResourcesService,
      useClass: SkyLibResourcesTestService
    }
  ]
})
export class SkyErrorFixturesModule { }
