import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PhoneFieldComponent } from './phone-field.component';

const routes = [
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
