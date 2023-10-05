import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { LookupInModalComponent } from './lookup-in-modal.component';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    component: LookupInModalComponent,
    data: {
      name: 'Lookup in Modal',
      icon: 'search',
    },
  },
];

@NgModule({
  imports: [LookupInModalComponent, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LookupInModalModule {
  public static routes = routes;
}
