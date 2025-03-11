import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ViewkeeperComponent } from './viewkeeper.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ViewkeeperComponent,
    data: {
      name: 'Viewkeeper',
      icon: 'window-header-horizontal',
      library: 'core',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ViewkeeperRoutingModule {
  public static routes = routes;
}
