import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { AlertDemoComponent } from './alert.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: AlertDemoComponent,
    data: {
      name: 'Alert',
      icon: 'sky-warning',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertRoutingModule {
  public static routes = routes;
}
