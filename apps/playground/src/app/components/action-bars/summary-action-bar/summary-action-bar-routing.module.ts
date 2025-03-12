import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SummaryActionBarComponent } from './summary-action-bar.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SummaryActionBarComponent,
    data: {
      name: 'Summary action bar (basic)',
      library: 'action-bars',
      icon: 'data-bar-horizontal',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SummaryActionBarRoutingModule {
  public static routes = routes;
}
