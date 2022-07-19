import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { KeyInfoComponent } from './key-info.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: KeyInfoComponent,
    data: {
      name: 'Key info',
      icon: 'key',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KeyInfoRoutingModule {
  public static routes = routes;
}
