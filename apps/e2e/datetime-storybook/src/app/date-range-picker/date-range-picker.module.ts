import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyDatePipeModule, SkyDateRangePickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { DateRangePickerComponent } from './date-range-picker.component';

const routes = [
  {
    path: '',
    component: DateRangePickerComponent,
  },
];
@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatePipeModule,
    SkyDateRangePickerModule,
    SkyInputBoxModule,
    RouterModule.forChild(routes),
  ],
  exports: [DateRangePickerComponent],
})
export class DateRangePickerModule {}
