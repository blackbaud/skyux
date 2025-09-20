import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TabsSummaryActionBarComponent } from './tabs-summary-action-bar.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TabsSummaryActionBarComponent,
    data: {
      name: 'Summary action bar (tab)',
      library: 'action-bars',
      icon: 'data-bar-horizontal',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsSummaryActionBarRoutingModule {
  public static routes = routes;
}
