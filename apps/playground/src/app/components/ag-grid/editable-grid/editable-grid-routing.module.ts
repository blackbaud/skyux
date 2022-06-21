import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditableGridComponent } from './editable-grid.component';

const routes: Routes = [
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
