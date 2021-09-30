import {
  NgModule
} from '@angular/core';

import {
  SkyAffixModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyTimepickerInputDirective
} from './timepicker.directive';

import {
  SkyTimepickerComponent
} from './timepicker.component';
import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

@NgModule({
  declarations: [
    SkyTimepickerInputDirective,
    SkyTimepickerComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyIconModule,
    SkyDatetimeResourcesModule,
    SkyAffixModule,
    SkyOverlayModule,
    SkyThemeModule
  ],
  exports: [
    SkyTimepickerInputDirective,
    SkyTimepickerComponent
  ]
})
export class SkyTimepickerModule { }
