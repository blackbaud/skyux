import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularTreeComponentComponent } from './angular-tree-component.component';

const routes: Routes = [
  {
    path: '',
    component: AngularTreeComponentComponent,
    data: {
      name: 'Angular tree component',
      icon: 'cube-tree',
      library: 'angular-tree-component',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularTreeComponentRoutingModule {
  public static routes = routes;
}
