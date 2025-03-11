import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DatepickerComponent } from './datepicker.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DatepickerComponent,
    data: {
      name: 'Datepicker',
      icon: 'calendar-ltr',
      library: 'datetime',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DatepickerRoutingModule {
  public static routes = routes;
}
