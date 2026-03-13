import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TextExpandComponent } from './text-expand.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TextExpandComponent,
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
