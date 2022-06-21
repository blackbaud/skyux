import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataManagerVisualComponent } from './data-manager-visual.component';

const routes: Routes = [
  {
    path: '',
    component: DataManagerVisualComponent,
    data: {
      name: 'AG Grid (data manager)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagerRoutingModule {
  public static routes = routes;
}
