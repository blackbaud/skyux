import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    loadComponent: () =>
      import('./modal-colorpicker.component').then(
        (m) => m.ModalColorpickerComponent,
      ),
    data: {
      name: 'Colorpicker inside Modal',
      icon: 'paint-brush',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalColorpickerRoutingModule {
  public static routes = routes;
}
