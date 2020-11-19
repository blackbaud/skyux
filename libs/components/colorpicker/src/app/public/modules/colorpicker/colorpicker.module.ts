import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyAffixModule,
  SkyCoreAdapterModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyInputBoxModule
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyColorpickerResourcesModule
} from '../shared/colorpicker-resources.module';

import {
  SkyColorpickerComponent
} from './colorpicker.component';

import {
  SkyColorpickerInputDirective
} from './colorpicker-input.directive';

import {
  SkyColorpickerService
} from './colorpicker.service';

import {
  SkyColorpickerSliderDirective
} from './colorpicker-slider.directive';

import {
  SkyColorpickerTextDirective
} from './colorpicker-text.directive';

@NgModule({
  declarations: [
    SkyColorpickerComponent,
    SkyColorpickerInputDirective,
    SkyColorpickerTextDirective,
    SkyColorpickerSliderDirective
  ],
  imports: [
    CommonModule,
    SkyAffixModule,
    SkyColorpickerResourcesModule,
    SkyCoreAdapterModule,
    SkyI18nModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyOverlayModule
  ],
  exports: [
    SkyColorpickerComponent,
    SkyColorpickerInputDirective
  ],
  providers: [
    SkyColorpickerService
  ],
  entryComponents: [
    SkyColorpickerComponent
  ]
})
export class SkyColorpickerModule { }
