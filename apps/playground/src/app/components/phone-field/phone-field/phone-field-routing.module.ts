import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { PhoneFieldComponent } from './phone-field.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: PhoneFieldComponent,
    data: {
      name: 'Phone field',
      icon: 'phone',
      library: 'phone-field',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class PhoneFieldRoutingModule {
  public static routes = routes;
}
