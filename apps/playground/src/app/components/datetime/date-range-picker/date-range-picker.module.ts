import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyDatePipeModule, SkyDateRangePickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { DateRangePickerRoutingModule } from './date-range-picker-routing.module';
import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    CommonModule,
    DateRangePickerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatePipeModule,
    SkyDateRangePickerModule,
    SkyInputBoxModule,
    RouterModule,
  ],
})
export class DateRangePickerModule {}
