import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonsComponent } from './buttons.component';

const routes = [
  {
    path: '',
    component: ButtonsComponent,
    data: {
      name: 'Button',
      icon: 'square-o',
      library: 'theme',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ButtonsRoutingModule {
  public static routes = routes;
}
