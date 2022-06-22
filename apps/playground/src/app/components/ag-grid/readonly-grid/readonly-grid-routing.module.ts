import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ReadonlyGridComponent } from './readonly-grid.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ReadonlyGridComponent,
    data: {
      name: 'AG Grid (readonly)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadonlyGridRoutingModule {
  public static routes = routes;
}
