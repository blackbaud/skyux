import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ButtonsComponent } from './buttons.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ButtonsComponent,
    data: {
      name: 'Button',
      icon: 'square',
      library: 'theme',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ButtonsRoutingModule {
  public static routes = routes;
}
