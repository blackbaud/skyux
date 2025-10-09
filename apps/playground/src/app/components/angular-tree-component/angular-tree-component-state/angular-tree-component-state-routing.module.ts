import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularTreeComponentStateComponent } from './angular-tree-component-state.component';

const routes: Routes = [
  {
    path: '',
    component: AngularTreeComponentStateComponent,
    data: {
      name: 'Angular tree component state',
      icon: 'cube-tree',
      library: 'angular-tree-component',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularTreeComponentStateRoutingModule {
  public static routes = routes;
}
