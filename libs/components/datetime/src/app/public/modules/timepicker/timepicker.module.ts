import {
  NgModule
} from '@angular/core';

import {
  SkyAffixModule,
  SkyCoreAdapterService,
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
    SkyIconModule,
    SkyDateTimeResourcesModule,
    SkyAffixModule,
    SkyOverlayModule
  ],
  providers: [
    SkyCoreAdapterService
  ],
  exports: [
    SkyTimepickerInputDirective,
    SkyTimepickerComponent
  ]
})
export class SkyTimepickerModule { }
