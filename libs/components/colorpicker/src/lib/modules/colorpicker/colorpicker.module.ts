import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAffixModule, SkyIdModule } from '@skyux/core';
import {
  SkyFormErrorModule,
  SkyFormErrorsModule,
  SkyInputBoxModule,
} from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyIconModule } from '@skyux/icon';
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
    A11yModule,
    CommonModule,
    SkyAffixModule,
    SkyColorpickerResourcesModule,
    SkyIdModule,
    SkyFormErrorModule,
    SkyFormErrorsModule,
    SkyHelpInlineModule,
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
