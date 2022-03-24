import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAffixModule, SkyOverlayModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyI18nModule } from '@skyux/i18n';
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
    SkyI18nModule,
    SkyIconModule,
    SkyInputBoxModule,
    SkyOverlayModule,
    SkyThemeModule,
  ],
  exports: [SkyColorpickerComponent, SkyColorpickerInputDirective],
})
export class SkyColorpickerModule {}
