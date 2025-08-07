import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ToastComponent } from './toast.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ToastComponent,
    data: {
      name: 'Toast',
      icon: 'mail',
      library: 'toast',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ToastRoutingModule {
  public static routes = routes;
}
