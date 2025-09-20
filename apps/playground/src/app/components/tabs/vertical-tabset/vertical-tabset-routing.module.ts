import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { VerticalTabsetComponent } from './vertical-tabset.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: VerticalTabsetComponent,
    data: {
      name: 'Vertical tabset',
      icon: 'folder-open',
      library: 'tabs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VerticalTabsetRoutingModule {
  public static routes = routes;
}
