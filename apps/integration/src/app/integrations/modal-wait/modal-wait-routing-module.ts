import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { ModalWaitComponent } from './modal-wait.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: ModalWaitComponent,
    data: {
      name: 'Wait inside Modal',
      icon: 'spinner-ios',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalWaitRoutingModule {
  public static routes = routes;
}
