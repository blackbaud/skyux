import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

import { GridPlaygroundComponent } from './grid/grid.component';

const routes: ComponentRouteInfo[] = [
  {
    path: 'grid',
    component: GridPlaygroundComponent,
    data: {
      name: 'Grid',
      icon: 'table',
      library: 'grids',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GridsFeatureRoutingModule {}

@NgModule({
  imports: [GridPlaygroundComponent, GridsFeatureRoutingModule],
})
export class GridsFeatureModule {
  public static routes = routes;
}
