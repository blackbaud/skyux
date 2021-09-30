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
  SkyIndicatorsResourcesModule
} from '../shared/sky-indicators-resources.module';

import {
  SkyWaitComponent
} from './wait.component';

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
    SkyWaitComponent
  ],
  entryComponents: [
    SkyWaitPageComponent
  ]
})
export class SkyWaitModule { }
