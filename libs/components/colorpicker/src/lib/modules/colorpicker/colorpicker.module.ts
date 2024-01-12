import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAffixModule } from '@skyux/core';
import { SkyFormErrorComponent, SkyFormErrorsModule, SkyInputBoxModule } from '@skyux/forms';
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
    SkyIconModule,
    SkyInputBoxModule,
    SkyThemeModule,
    SkyFormErrorsModule,
    SkyFormErrorComponent
  ],
  exports: [SkyColorpickerComponent, SkyColorpickerInputDirective, SkyFormErrorComponent],
})
export class SkyColorpickerModule {}
