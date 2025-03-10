import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { RadioComponent } from './radio.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: RadioComponent,
    data: {
      name: 'Radio',
      icon: 'circle',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class RadioRoutingModule {
  public static routes = routes;
}
