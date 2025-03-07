import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DatePipeComponent } from './basic/date-pipe.component';
import { DatePipeProviderComponent } from './provider/date-pipe-provider.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DatePipeComponent,
    data: {
      name: 'Date pipe (basic)',
      icon: 'calendar-ltr',
      library: 'datetime',
    },
  },
  {
    path: 'provider',
    component: DatePipeProviderComponent,
    data: {
      name: 'Date pipe (locale provider)',
      icon: 'calendar-ltr',
      library: 'datetime',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DatePipeRoutingModule {
  public static routes = routes;
}
