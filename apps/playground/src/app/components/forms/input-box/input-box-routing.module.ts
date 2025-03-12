import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { InputBoxDisabledComponent } from './input-box-disabled.component';
import { InputBoxComponent } from './input-box.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: InputBoxComponent,
    data: {
      name: 'Input box',
      icon: 'form',
      library: 'forms',
    },
  },
  {
    path: 'disabled',
    component: InputBoxDisabledComponent,
    data: {
      name: 'Input box (disabled)',
      icon: 'form',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class InputBoxRoutingModule {
  public static routes = routes;
}
