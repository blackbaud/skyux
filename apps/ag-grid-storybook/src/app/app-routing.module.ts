import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'visual',
  },
  {
    path: 'visual',
    component: VisualComponent,
  },
  {
    path: 'visual/data-manager',
    loadChildren: () =>
      import('./visual/data-manager/data-manager.module').then(
        (m) => m.DataManagerModule
      ),
  },
  {
    path: 'visual/edit-complex-cells',
    loadChildren: () =>
      import('./visual/edit-complex-cells/edit-complex-cells.module').then(
        (m) => m.EditComplexCellsModule
      ),
  },
  {
    path: 'visual/edit-in-modal-grid',
    loadChildren: () =>
      import('./visual/edit-in-modal-grid/edit-in-modal-grid.module').then(
        (m) => m.EditInModalGridModule
      ),
  },
  {
    path: 'visual/edit-stop-when-loses-focus',
    loadChildren: () =>
      import(
        './visual/edit-stop-when-loses-focus/edit-stop-when-loses-focus.module'
      ).then((m) => m.EditStopWhenLosesFocusModule),
  },
  {
    path: 'visual/editable-grid',
    loadChildren: () =>
      import('./visual/editable-grid/editable-grid.module').then(
        (m) => m.EditableGridModule
      ),
  },
  {
    path: 'visual/readonly-grid',
    loadChildren: () =>
      import('./visual/readonly-grid/readonly-grid.module').then(
        (m) => m.ReadonlyGridModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
