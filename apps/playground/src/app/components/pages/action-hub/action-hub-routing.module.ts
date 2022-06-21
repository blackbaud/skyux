import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionHubPlaygroundRecentLinksComponent } from './recent/action-hub-recent-links.component';

const routes: Routes = [
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
