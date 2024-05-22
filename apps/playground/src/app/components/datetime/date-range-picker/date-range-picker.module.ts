import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DateRangePickerRoutingModule } from './date-range-picker-routing.module';
import { DateRangePickerComponent } from './date-range-picker.component';

@NgModule({
  imports: [
    DateRangePickerComponent,
    DateRangePickerRoutingModule,
    RouterModule,
  ],
})
export class DateRangePickerModule {
  public static routes = DateRangePickerRoutingModule.routes;
}
