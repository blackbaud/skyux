import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { CountryFieldComponent } from './country-field.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: CountryFieldComponent,
    data: {
      name: 'Country field',
      icon: 'globe',
      library: 'lookup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CountryFieldRoutingModule {
  public static routes = routes;
}
