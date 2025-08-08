import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { ModalSplitViewTileDashboardComponent } from './modal-split-view-tile-dashboard.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: ModalSplitViewTileDashboardComponent,
    data: {
      name: 'Modal Split View Tile Dashboard',
      icon: 'layout-column-three',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSplitViewTileDashboardRoutingModule {
  public static routes = routes;
}
