import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SplitViewComponent } from './basic/split-view.component';
import { SplitViewPageBoundComponent } from './page-bound/split-view-page-bound.compoennt';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SplitViewComponent,
    data: {
      name: 'Split view (basic)',
      icon: 'columns',
      library: 'split-view',
    },
  },
  {
    path: 'page-bound',
    component: SplitViewPageBoundComponent,
    data: {
      name: 'Split view (page bound)',
      icon: 'columns',
      library: 'split-view',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SplitViewRoutingModule {
  public static routes = routes;
}
