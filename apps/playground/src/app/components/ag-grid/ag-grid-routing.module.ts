import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'data-manager',
    loadChildren: () => import('./data-manager/routes'),
  },
  {
    path: 'data-manager-large',
    loadChildren: () =>
      import('./data-manager-large/data-manager-large.module').then(
        (m) => m.DataManagerLargeModule
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
export class AgGridRoutingModule {
  public static routes = routes;
}
