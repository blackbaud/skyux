import { NgModule } from '@angular/core';

import { DateRangePickerRoutingModule } from './date-range-picker-routing.module';
import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  imports: [DateRangePickerComponent, DateRangePickerRoutingModule],
})
export class DateRangePickerModule {
  public static routes = DateRangePickerRoutingModule.routes;
}
