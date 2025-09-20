import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ToolbarComponent } from './toolbar.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ToolbarComponent,
    data: {
      name: 'Toolbar',
      icon: 'navigation',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolbarRoutingModule {
  public static routes = routes;
}
