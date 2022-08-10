import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DataManagerLargeComponent } from './data-manager-large.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DataManagerLargeComponent,
    data: {
      name: 'AG Grid (data manager large)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagerLargeRoutingModule {
  public static routes = routes;
}
