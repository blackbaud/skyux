import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AgGridComponent } from './ag-grid.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: AgGridComponent,
  },
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./data-manager/data-manager.module').then(
        (m) => m.DataManagerModule
      ),
  },
  {
    path: 'edit-complex-cells',
    loadChildren: () =>
      import('./edit-complex-cells/edit-complex-cells.module').then(
        (m) => m.EditComplexCellsModule
      ),
  },
  {
    path: 'edit-in-modal-grid',
    loadChildren: () =>
      import('./edit-in-modal-grid/edit-in-modal-grid.module').then(
        (m) => m.EditInModalGridModule
      ),
  },
  {
    path: 'edit-stop-when-loses-focus',
    loadChildren: () =>
      import(
        './edit-stop-when-loses-focus/edit-stop-when-loses-focus.module'
      ).then((m) => m.EditStopWhenLosesFocusModule),
  },
  {
    path: 'editable-grid',
    loadChildren: () =>
      import('./editable-grid/editable-grid.module').then(
        (m) => m.EditableGridModule
      ),
  },
  {
    path: 'readonly-grid',
    loadChildren: () =>
      import('./readonly-grid/readonly-grid.module').then(
        (m) => m.ReadonlyGridModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgGridRoutingModule {}
