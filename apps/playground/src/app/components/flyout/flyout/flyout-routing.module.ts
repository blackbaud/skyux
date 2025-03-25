import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { FlyoutComponent } from './flyout.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: FlyoutComponent,
    data: {
      name: 'Flyout',
      icon: 'layout-column-three',
      library: 'flyout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FlyoutRoutingModule {
  public static routes = routes;
}
