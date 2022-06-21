import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReadonlyGridComponent } from './readonly-grid.component';

const routes: Routes = [
  {
    path: '',
    component: ReadonlyGridComponent,
    data: {
      name: 'AG Grid (readonly)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReadonlyGridRoutingModule {
  public static routes = routes;
}
