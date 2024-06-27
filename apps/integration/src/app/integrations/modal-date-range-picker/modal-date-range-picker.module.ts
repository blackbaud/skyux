import { NgModule } from '@angular/core';

import { ModalDateRangePickerRoutingModule } from './modal-date-range-picker-routing.module';

@NgModule({
  imports: [ModalDateRangePickerRoutingModule],
})
export class ModalDateRangePickerModule {
  public static routes = ModalDateRangePickerRoutingModule.routes;
}
