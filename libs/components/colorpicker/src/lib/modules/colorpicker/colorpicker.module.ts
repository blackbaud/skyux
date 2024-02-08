import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAffixModule } from '@skyux/core';
import {
  SkyFormErrorModule,
  SkyFormErrorsModule,
  SkyInputBoxModule,
} from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyColorpickerResourcesModule } from '../shared/sky-colorpicker-resources.module';

import { SkyColorpickerInputDirective } from './colorpicker-input.directive';
import { SkyColorpickerSliderDirective } from './colorpicker-slider.directive';
import { SkyColorpickerTextDirective } from './colorpicker-text.directive';
import { SkyColorpickerComponent } from './colorpicker.component';

@NgModule({
  declarations: [
    SkyColorpickerComponent,
    SkyColorpickerInputDirective,
    SkyColorpickerTextDirective,
    SkyColorpickerSliderDirective,
  ],
  imports: [
    CommonModule,
    SkyAffixModule,
    SkyColorpickerResourcesModule,
    SkyFormErrorModule,
    SkyFormErrorsModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyThemeModule,
  ],
  exports: [
    SkyColorpickerComponent,
    SkyColorpickerInputDirective,
    SkyFormErrorModule,
  ],
})
export class SkyColorpickerModule {}
