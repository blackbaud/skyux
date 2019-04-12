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
  SkyDropdownModule
} from '@skyux/popovers';

import {
  SkyDateTimeResourcesModule
} from '../shared/datetime-resources.module';

import {
  SkyTimepickerInputDirective
} from './timepicker.directive';

import {
  SkyTimepickerComponent
} from './timepicker.component';

@NgModule({
  declarations: [
    SkyTimepickerInputDirective,
    SkyTimepickerComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyDateTimeResourcesModule,
    SkyDropdownModule
  ],
  exports: [
    SkyTimepickerInputDirective,
    SkyTimepickerComponent
  ]
})
export class SkyTimepickerModule { }
