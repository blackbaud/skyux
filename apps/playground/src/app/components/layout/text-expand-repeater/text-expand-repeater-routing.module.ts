import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TextExpandRepeaterComponent } from './text-expand-repeater.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TextExpandRepeaterComponent,
    data: {
      name: 'Text expand repeater',
      icon: 'navigation',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextExpandRepeaterRoutingModule {
  public static routes = routes;
}
