import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { WaitComponent } from './wait.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: WaitComponent,
    data: {
      name: 'Wait',
      icon: 'spinner-ios',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitRoutingModule {
  public static routes = routes;
}
