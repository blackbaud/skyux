import { NgModule } from '@angular/core';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyTimepickerComponent } from './timepicker.component';
import { SkyTimepickerInputDirective } from './timepicker.directive';

@NgModule({
  imports: [
    SkyDatetimeResourcesModule,
    SkyTimepickerInputDirective,
    SkyTimepickerComponent,
  ],
  exports: [SkyTimepickerInputDirective, SkyTimepickerComponent],
})
export class SkyTimepickerModule {}
