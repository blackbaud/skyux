import { NgModule } from '@angular/core';

import { SkyTimepickerComponent } from './timepicker.component';
import { SkyTimepickerInputDirective } from './timepicker.directive';

@NgModule({
  imports: [SkyTimepickerInputDirective, SkyTimepickerComponent],
  exports: [SkyTimepickerInputDirective, SkyTimepickerComponent],
})
export class SkyTimepickerModule {}
