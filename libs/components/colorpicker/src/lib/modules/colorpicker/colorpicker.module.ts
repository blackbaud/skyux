import { NgModule } from '@angular/core';

import { SkyColorpickerInputDirective } from './colorpicker-input.directive';
import { SkyColorpickerSliderDirective } from './colorpicker-slider.directive';
import { SkyColorpickerTextDirective } from './colorpicker-text.directive';
import { SkyColorpickerComponent } from './colorpicker.component';

@NgModule({
  imports: [
    SkyColorpickerComponent,
    SkyColorpickerInputDirective,
    SkyColorpickerSliderDirective,
    SkyColorpickerTextDirective,
  ],
  exports: [SkyColorpickerComponent, SkyColorpickerInputDirective],
})
export class SkyColorpickerModule {}
