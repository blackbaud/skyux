import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { ViewkeeperTabsetComponent } from './viewkeeper-tabset.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: ViewkeeperTabsetComponent,
    data: {
      name: 'Viewkeeper inside Tabset',
      icon: 'arrow-maximize',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ViewkeeperTabsetRoutingModule {
  public static routes = routes;
}
