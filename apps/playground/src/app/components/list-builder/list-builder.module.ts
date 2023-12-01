import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

const routes: ComponentRouteInfo[] = [
  {
    path: 'grid',
    loadComponent: () => import('./list-view-grid/list-view-grid.component'),
    data: {
      name: 'AAA List Builder Grid',
      icon: 'table',
      library: 'list-builder-view-grids',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
class ListBuilderRoutingModule {}

@NgModule({
  imports: [ListBuilderRoutingModule],
})
export class ListBuilderModule {
  public static routes = routes;
}
