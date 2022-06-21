import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ViewkeeperComponent } from './viewkeeper.component';

const routes = [
  {
    path: '',
    component: ViewkeeperComponent,
    data: {
      name: 'Viewkeeper',
      icon: 'window-maximize',
      library: 'core',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ViewkeeperRoutingModule {
  public static routes = routes;
}
