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
  SkyIconModule
} from '../icon';

import {
  SkyIndicatorsResourcesModule
} from '../shared';

import {
  SkyAlertComponent
} from './alert.component';

@NgModule({
  declarations: [SkyAlertComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule
  ],
  exports: [SkyAlertComponent]
})
export class SkyAlertModule { }
