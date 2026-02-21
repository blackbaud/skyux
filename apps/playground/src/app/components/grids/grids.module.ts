import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

import {
  GridVisualComponent,
  GridVisualComponentModule,
} from './grid/grid-visual.component';

const routes: ComponentRouteInfo[] = [
  {
    path: 'grid',
    component: GridVisualComponent,
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
  imports: [GridVisualComponentModule, GridsFeatureRoutingModule],
})
export class GridsFeatureModule {
  public static routes = routes;
}
