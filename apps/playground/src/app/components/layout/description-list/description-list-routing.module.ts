import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DescriptionListComponent } from './description-list.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DescriptionListComponent,
    data: {
      name: 'Description list',
      icon: 'text-bullet-list',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DescriptionListRoutingModule {
  public static routes = routes;
}
