import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TileDashboardComponent } from './tile-dashboard.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TileDashboardComponent,
    data: {
      name: 'Tile dashboard',
      icon: 'data-histogram',
      library: 'tiles',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TileDashboardRoutingModule {
  public static routes = routes;
}
