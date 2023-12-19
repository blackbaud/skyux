import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    loadComponent: () =>
      import('./modal-footer-dropdown.component').then(
        (m) => m.ModalFooterDropdownComponent,
      ),
    data: {
      name: 'Dropdown in Modal Footer',
      icon: 'ellipsis',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalFooterDropdownRoutingModule {
  public static routes = routes;
}
