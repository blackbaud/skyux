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
  SkyIconModule
} from '../icon/icon.module';

import {
  SkyAlertComponent
} from './alert.component';

@NgModule({
  declarations: [
    SkyAlertComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule
  ],
  exports: [
    SkyAlertComponent
  ]
})
export class SkyAlertModule { }
