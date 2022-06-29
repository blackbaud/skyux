import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SkyAgGridDemoComponent,
    data: {
      name: 'AG Grid (modal editing)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditInModalGridRoutingModule {
  public static routes = routes;
}
