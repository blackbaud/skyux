import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { ModalColorpickerComponent } from './modal-colorpicker.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: ModalColorpickerComponent,
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
