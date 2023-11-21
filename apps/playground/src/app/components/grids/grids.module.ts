import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

const routes: ComponentRouteInfo[] = [
  {
    path: 'basic',
    loadComponent: () => import('./basic/grid.component'),
    data: {
      name: 'AAA SKY Grid',
      icon: 'table',
      library: 'grid',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
class GridsRoutingModule {}

@NgModule({
  imports: [GridsRoutingModule],
})
export class GridsModule {
  public static routes = routes;
}
