import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DateRangePickerComponent,
      },
    ]),
  ],
})
export class DateRangePickerRoutingModule {}
