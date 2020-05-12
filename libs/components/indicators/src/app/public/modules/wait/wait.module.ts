import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyAppWindowRef
} from '@skyux/core';

import {
  SkyIndicatorsResourcesModule
} from '../shared/indicators-resources.module';

import {
  SkyWaitComponent
} from './wait.component';

import {
  SkyWaitService
} from './wait.service';

import {
  SkyWaitPageAdapterService
} from './wait-page-adapter.service';

import {
  SkyWaitPageComponent
} from './wait-page.component';

@NgModule({
  declarations: [
    SkyWaitComponent,
    SkyWaitPageComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIndicatorsResourcesModule
  ],
  exports: [
    SkyWaitComponent,
    SkyWaitPageComponent
  ],
  providers: [
    SkyWaitService,
    SkyWaitPageAdapterService,
    SkyAppWindowRef
  ],
  entryComponents: [
    SkyWaitPageComponent
  ]
})
export class SkyWaitModule { }
