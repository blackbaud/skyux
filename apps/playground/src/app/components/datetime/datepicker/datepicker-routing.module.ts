import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DatepickerComponent } from './datepicker.component';

const routes = [
  {
    path: '',
    component: DatepickerComponent,
    data: {
      name: 'Datepicker',
      icon: 'calendar',
      library: 'datetime',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class DatepickerRoutingModule {
  public static routes = routes;
}
