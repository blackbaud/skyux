import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { VerticalTabsetBackToTopComponent } from './vertical-tabset-back-to-top.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: VerticalTabsetBackToTopComponent,
    data: {
      name: 'Back to Top inside Vertical Tabset',
      icon: 'arrow-up',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VerticalTabsetBackToTopRoutingModule {
  public static routes = routes;
}
