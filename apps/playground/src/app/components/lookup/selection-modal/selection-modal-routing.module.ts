import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SelectionModalComponent } from './selection-modal.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SelectionModalComponent,
    data: {
      name: 'Selection modal',
      icon: 'text-bullet-list',
      library: 'lookup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SelectionModalRoutingModule {
  public static routes = routes;
}
