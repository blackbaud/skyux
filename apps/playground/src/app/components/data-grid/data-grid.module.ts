import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

const routes: ComponentRouteInfo[] = [
  {
    path: 'basic',
    loadComponent: () => import('./basic/grid.component'),
    data: {
      name: 'Data Grid (new)',
      icon: 'table',
      library: 'grids',
    },
  },
  {
    path: 'paging',
    loadComponent: () => import('./paging/grid-paging.component'),
    data: {
      name: 'Data Grid Paging (new)',
      icon: 'table',
      library: 'grids',
    },
  },
  {
    path: 'filtered',
    loadComponent: () => import('./filtered/grid.component'),
    data: {
      name: 'Data Grid Filtered (new)',
      icon: 'filter',
      library: 'grids',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
class DataGridRoutingModule {}

@NgModule({
  imports: [DataGridRoutingModule],
})
export class DataGridModule {
  public static routes = routes;
}
