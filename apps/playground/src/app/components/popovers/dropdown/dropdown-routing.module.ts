import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DropdownComponent } from './dropdown.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DropdownComponent,
    data: {
      name: 'Dropdown',
      icon: 'caret-down',
      library: 'popovers',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DropdownRoutingModule {
  public static routes = routes;
}
