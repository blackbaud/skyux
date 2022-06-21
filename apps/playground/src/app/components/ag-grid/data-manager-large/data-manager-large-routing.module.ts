import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataManagerLargeComponent } from './data-manager-large.component';

const routes: Routes = [
  {
    path: '',
    component: DataManagerLargeComponent,
    data: {
      name: 'AG Grid (data manager large)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataManagerLargeRoutingModule {
  public static routes = routes;
}
