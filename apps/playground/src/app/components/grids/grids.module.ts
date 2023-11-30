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
      library: 'grids',
    },
  },
  {
    path: 'paging',
    loadComponent: () => import('./paging/grid-paging.component'),
    data: {
      name: 'AAB SKY Grid Paging',
      icon: 'table',
      library: 'grids',
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
