import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DateRangePickerComponent } from './date-range-picker.component';

const routes = [
  {
    path: '',
    component: DateRangePickerComponent,
    data: {
      name: 'Date range picker',
      icon: 'calendar',
      library: 'datetime',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DateRangePickerRoutingModule {
  public static routes = routes;
}
