import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DataManagerVisualComponent } from './data-manager-visual.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DataManagerVisualComponent,
    data: {
      name: 'AG Grid (data manager)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagerRoutingModule {
  public static routes = routes;
}
