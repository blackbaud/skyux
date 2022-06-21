import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SkyAgGridDemoComponent } from './ag-grid-demo.component';

const routes: Routes = [
  {
    path: '',
    component: SkyAgGridDemoComponent,
    data: {
      name: 'AG Grid (modal editing)',
      library: 'ag-grid',
      icon: 'table',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditInModalGridRoutingModule {
  public static routes = routes;
}
