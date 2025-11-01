import { NgModule } from '@angular/core';

import { SkyColorpickerResourcesModule } from '../shared/sky-colorpicker-resources.module';

import { SkyColorpickerInputDirective } from './colorpicker-input.directive';
import { SkyColorpickerSliderDirective } from './colorpicker-slider.directive';
import { SkyColorpickerTextDirective } from './colorpicker-text.directive';
import { SkyColorpickerComponent } from './colorpicker.component';

@NgModule({
  imports: [
    SkyColorpickerResourcesModule,
    SkyColorpickerComponent,
    SkyColorpickerInputDirective,
    SkyColorpickerTextDirective,
    SkyColorpickerSliderDirective,
  ],
  exports: [SkyColorpickerComponent, SkyColorpickerInputDirective],
})
export class SkyColorpickerModule {}
