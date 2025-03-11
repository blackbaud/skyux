import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

import { ModalVisualComponent } from './modal-visual.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ModalVisualComponent,
    data: {
      name: 'Modal',
      library: 'modal',
      icon: 'square',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalVisualRoutingModule {
  public static routes = routes;
}
