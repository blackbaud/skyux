import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FieldGroupComponent } from './field-group.component';

const routes: Routes = [
  {
    path: '',
    component: FieldGroupComponent,
    data: {
      name: 'Field group',
      icon: 'text-bullet-list',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FieldGroupRoutingModule {
  public static routes = routes;
}
