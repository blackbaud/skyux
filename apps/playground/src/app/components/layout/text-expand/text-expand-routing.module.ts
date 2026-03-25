import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    loadComponent: () => import('./text-expand.component'),
    data: {
      name: 'Text expand',
      icon: 'navigation',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextExpandRoutingModule {
  public static routes = routes;
}
