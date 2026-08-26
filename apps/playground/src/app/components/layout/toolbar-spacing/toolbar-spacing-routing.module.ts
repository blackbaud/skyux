import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ToolbarSpacingComponent } from './toolbar-spacing.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ToolbarSpacingComponent,
    data: {
      name: 'Toolbar spacing',
      icon: 'navigation',
      library: 'layout',
    },
  },
  {
    path: 'list-page',
    loadComponent: () => import('./toolbar-spacing-list-page.component'),
    data: {
      name: 'Toolbar spacing (list page)',
      icon: 'text-bullet-list',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ToolbarSpacingRoutingModule {
  public static routes = routes;
}
