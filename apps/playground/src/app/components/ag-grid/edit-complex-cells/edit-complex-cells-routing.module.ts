import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { EditComplexCellsInModalComponent } from './edit-complex-cells-in-modal.component';
import { EditComplexCellsComponent } from './edit-complex-cells.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: EditComplexCellsComponent,
    data: {
      name: 'AG Grid (complex cell editing)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
  {
    path: 'modal',
    component: EditComplexCellsInModalComponent,
    data: {
      name: 'AG Grid (complex cell editing in modal)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditComplexCellsRoutingModule {
  public static routes = routes;
}
