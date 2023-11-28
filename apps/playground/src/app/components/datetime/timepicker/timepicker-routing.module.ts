import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TimepickerComponent } from './timepicker.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TimepickerComponent,
    data: {
      name: 'Timepicker',
      icon: 'clock',
      library: 'datetime',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TimepickerRoutingModule {
  public static routes = routes;
}
