import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ModalSummaryActionBarComponent } from './modal-summary-action-bar.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ModalSummaryActionBarComponent,
    data: {
      name: 'Summary action bar (modal)',
      library: 'action-bars',
      icon: 'data-bar-horizontal',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalSummaryActionBarRoutingModule {
  public static routes = routes;
}
