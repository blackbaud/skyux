// spell-checker:ignore Colorpicker, Dropdown
import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyAffixModule,
  SkyCoreAdapterModule,
  SkyOverlayModule
} from '@skyux/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyColorpickerResourcesModule
} from '../shared';

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
  SkyColorpickerTextDirective
} from './colorpicker-text.directive';
import {
  SkyColorpickerSliderDirective
} from './colorpicker-slider.directive';

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
