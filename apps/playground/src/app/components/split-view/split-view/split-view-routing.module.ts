import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SplitViewComponent } from './basic/split-view.component';
import { SplitViewDataManagerComponent } from './data-manager/split-view-data-manager.component';
import { SplitViewPageBoundComponent } from './page-bound/split-view-page-bound.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SplitViewComponent,
    data: {
      name: 'Split view (basic)',
      icon: 'layout-column-three',
      library: 'split-view',
    },
  },
  {
    path: 'page-bound',
    component: SplitViewPageBoundComponent,
    data: {
      name: 'Split view (page bound)',
      icon: 'layout-column-three',
      library: 'split-view',
    },
  },
  {
    path: 'data-manager',
    component: SplitViewDataManagerComponent,
    data: {
      name: 'Split view (data manager)',
      icon: 'layout-column-three',
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
