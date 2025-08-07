import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';
import { SettingsComponent } from './settings/settings.component';

const routes: ComponentRouteInfo[] = [
  {
    path: 'recent',
    component: ActionHubPlaygroundRecentLinksComponent,
    data: {
      name: 'Action hub (recently accessed)',
      icon: 'alert',
      library: 'pages',
    },
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      name: 'Action hub (settings)',
      icon: 'settings',
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
