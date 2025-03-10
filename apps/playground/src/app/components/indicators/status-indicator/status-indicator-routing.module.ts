import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { StatusIndicatorComponent } from './status-indicator.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: StatusIndicatorComponent,
    data: {
      name: 'Status indicator',
      icon: 'sky-warning',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatusIndicatorRoutingModule {
  public static routes = routes;
}
