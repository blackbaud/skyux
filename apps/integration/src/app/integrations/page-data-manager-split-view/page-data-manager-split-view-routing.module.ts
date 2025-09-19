import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    loadComponent: () =>
      import('./page-data-manager-split-view.component').then(
        (m) => m.PageDataManagerSplitViewComponent,
      ),
    data: {
      name: 'Page Data Manager Split View',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PageDataManagerSplitViewRoutingModule {
  public static routes = routes;
}
