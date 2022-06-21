import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ActionButtonComponent } from './action-button.component';

const routes: Routes = [
  {
    path: '',
    component: ActionButtonComponent,
    data: {
      name: 'Action button',
      icon: 'square-o',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionButtonRoutingModule {
  public static routes = routes;
}
