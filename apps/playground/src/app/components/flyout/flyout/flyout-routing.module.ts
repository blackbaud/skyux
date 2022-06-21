import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FlyoutComponent } from './flyout.component';

const routes = [
  {
    path: '',
    component: FlyoutComponent,
    data: {
      name: 'Flyout',
      icon: 'columns',
      library: 'flyout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class FlyoutRoutingModule {
  public static routes = routes;
}
