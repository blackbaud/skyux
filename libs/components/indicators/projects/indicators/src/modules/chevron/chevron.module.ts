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
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyIndicatorsResourcesModule
} from '../shared/sky-indicators-resources.module';

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
    SkyIndicatorsResourcesModule,
    SkyThemeModule
  ],
  exports: [
    SkyChevronComponent
  ]
})
export class SkyChevronModule { }
