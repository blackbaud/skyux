import { AsyncPipe, NgIf } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SkyLookupModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

import { LookupInModalComponent } from './lookup-in-modal.component';
import { ModalLookupComponent } from './modal-lookup.component';

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
  declarations: [LookupInModalComponent, ModalLookupComponent],
  imports: [
    AsyncPipe,
    NgIf,
    SkyLookupModule,
    SkyModalModule,
    RouterLink,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class LookupInModalModule {
  public static routes = routes;
}
