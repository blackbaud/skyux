import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { IntegrationRouteInfo } from '../../shared/integration-info/integration-route-info';

const routes: IntegrationRouteInfo[] = [
  {
    path: '',
    loadComponent: () =>
      import('./modal-date-range-picker.component').then(
        (m) => m.ModalDateRangePickerComponent,
      ),
    data: {
      name: 'Date range picker inside Modal',
      icon: 'calendar-ltr',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ModalDateRangePickerRoutingModule {
  public static routes = routes;
}
