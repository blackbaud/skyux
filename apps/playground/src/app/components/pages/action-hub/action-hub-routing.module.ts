import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';

const routes: ComponentRouteInfo[] = [
  {
    path: 'recent',
    component: ActionHubPlaygroundRecentLinksComponent,
    data: {
      name: 'Action hub (recently accessed)',
      icon: 'bell-o',
      library: 'pages',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionHubRoutingModule {
  public static routes = routes;
}
