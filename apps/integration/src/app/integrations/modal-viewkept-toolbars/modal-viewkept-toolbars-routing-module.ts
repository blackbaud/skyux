import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { ModalViewkeptToolbarsComponent } from './modal-viewkept-toolbars.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: ModalViewkeptToolbarsComponent,
    data: {
      name: 'Viewkept Toolbars inside Modal',
      icon: 'arrow-maximize',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalViewkeptToolbarsRoutingModule {
  public static routes = routes;
}
