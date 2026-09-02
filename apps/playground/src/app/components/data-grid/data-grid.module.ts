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
    path: 'docked-in-fit-layout',
    loadComponent: () =>
      import('./docked-in-fit-layout/docked-in-fit-layout.component'),
    data: {
      name: 'Data Grid docked in a fit layout page',
      icon: 'table',
      library: 'data-grid',
    },
  },
  {
    path: 'docked-tabs',
    loadComponent: () => import('./docked-tabs/./docked-tabs.component'),
    data: {
      name: 'Data grid docked in a tabs page',
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
