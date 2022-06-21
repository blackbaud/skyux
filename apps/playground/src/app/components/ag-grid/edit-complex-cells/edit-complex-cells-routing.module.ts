import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditComplexCellsComponent } from './edit-complex-cells.component';

const routes: Routes = [
  {
    path: '',
    component: EditComplexCellsComponent,
    data: {
      name: 'AG Grid (complex cell editing)',
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
