import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyInputBoxModule } from '@skyux/forms';
import { RouterModule } from '@angular/router';
import { SkyDatePipeModule, SkyDateRangePickerModule } from '@skyux/datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateRangePickerComponent } from './date-range-picker.component';
import { DateRangePickerRoutingModule } from './date-range-picker-routing.module';

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
