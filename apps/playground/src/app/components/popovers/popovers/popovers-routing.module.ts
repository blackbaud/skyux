import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { PopoversComponent } from './popovers.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: PopoversComponent,
    data: {
      name: 'Popover',
      icon: 'chevron-down',
      library: 'popovers',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PopoversRoutingModule {
  public static routes = routes;
}
