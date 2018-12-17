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
} from '../shared/indicators-resources.module';

import {
  SkyChevronComponent
} from './chevron.component';

@NgModule({
  declarations: [
    SkyChevronComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIndicatorsResourcesModule
  ],
  exports: [
    SkyChevronComponent
  ]
})
export class SkyChevronModule { }
