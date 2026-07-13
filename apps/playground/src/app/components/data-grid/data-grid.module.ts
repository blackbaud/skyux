import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

const routes: ComponentRouteInfo[] = [
  {
    path: 'basic',
    loadComponent: () => import('./basic/data-grid.component'),
    data: {
      name: 'Data Grid',
      icon: 'table',
      library: 'data-grid',
    },
  },
  {
    path: 'fit-layout',
    loadComponent: () => import('./fit-layout/fit-layout.component'),
    data: {
      name: 'Data Grid fit layout',
      icon: 'table',
      library: 'data-grid',
    },
  },
  {
    path: 'fit-tabs',
    loadComponent: () => import('./fit-tabs/fit-tabs.component'),
    data: {
      name: 'Data Grid fit tabs',
      icon: 'table',
      library: 'data-grid',
    },
  },
  {
    path: 'paging',
    loadComponent: () => import('./paging/grid-paging.component'),
    data: {
      name: 'Data Grid Paging',
      icon: 'table',
      library: 'data-grid',
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
