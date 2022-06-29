import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { EditStopWhenLosesFocusComponent } from './edit-stop-when-loses-focus.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: EditStopWhenLosesFocusComponent,
    data: {
      name: 'AG Grid (stop editing with focus loss)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditStopWhenLosesFocusRoutingModule {
  public static routes = routes;
}
