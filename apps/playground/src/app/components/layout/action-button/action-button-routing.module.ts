import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ActionButtonComponent } from './action-button.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ActionButtonComponent,
    data: {
      name: 'Action button',
      icon: 'square',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionButtonRoutingModule {
  public static routes = routes;
}
