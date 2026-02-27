import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    loadComponent: () => import('./home.component'),
    data: {
      name: 'Data manager test',
      library: 'data-manager',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestRoutingModule {
  public static routes = routes;
}
