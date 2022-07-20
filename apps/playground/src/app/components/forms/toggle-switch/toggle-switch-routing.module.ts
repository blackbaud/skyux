import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ToggleSwitchComponent } from './toggle-switch.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ToggleSwitchComponent,
    data: {
      name: 'Toggle switch',
      icon: 'toggle-on',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ToggleSwitchRoutingModule {
  public static routes = routes;
}
