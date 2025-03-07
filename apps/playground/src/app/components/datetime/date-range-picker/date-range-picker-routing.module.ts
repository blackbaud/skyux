import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DateRangePickerComponent } from './date-range-picker.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DateRangePickerComponent,
    data: {
      name: 'Date range picker',
      icon: 'calendar-ltr',
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
