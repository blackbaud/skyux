import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { BoxComponent } from './box.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: BoxComponent,
    data: {
      name: 'Box',
      icon: 'square',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoxRoutingModule {
  public static routes = routes;
}
