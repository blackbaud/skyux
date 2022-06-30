import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { EditableGridComponent } from './editable-grid.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: EditableGridComponent,
    data: {
      name: 'AG Grid (editable)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditableGridRoutingModule {
  public static routes = routes;
}
