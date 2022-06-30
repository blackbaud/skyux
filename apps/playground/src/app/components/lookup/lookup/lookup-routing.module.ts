import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { LookupComponent } from './lookup.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: LookupComponent,
    data: {
      name: 'Lookup',
      icon: 'search',
      library: 'lookup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class LookupRoutingModule {
  public static routes = routes;
}
