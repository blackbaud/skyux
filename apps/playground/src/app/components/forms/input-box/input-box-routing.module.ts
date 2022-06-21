import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { InputBoxComponent } from './input-box.component';

const routes = [
  {
    path: '',
    component: InputBoxComponent,
    data: {
      name: 'Input box',
      icon: 'server',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class InputBoxRoutingModule {
  public static routes = routes;
}
