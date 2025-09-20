import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ToolbarStandardItemsComponent } from './toolbar-standard-items.component';

const routes: Routes = [
  {
    path: '',
    component: ToolbarStandardItemsComponent,
    data: {
      name: 'Toolbar with standard items',
      icon: 'options',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolbarStandardItemsRoutingModule {
  public static routes = routes;
}
