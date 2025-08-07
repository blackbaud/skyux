import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckboxComponent } from './checkbox.component';

const routes: Routes = [
  {
    path: '',
    component: CheckboxComponent,
    data: {
      name: 'Checkbox',
      icon: 'checkmark-square',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckboxRoutingModule {
  public static routes = routes;
}
