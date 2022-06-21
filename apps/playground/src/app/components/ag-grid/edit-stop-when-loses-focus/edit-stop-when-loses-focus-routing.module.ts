import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditStopWhenLosesFocusComponent } from './edit-stop-when-loses-focus.component';

const routes: Routes = [
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
