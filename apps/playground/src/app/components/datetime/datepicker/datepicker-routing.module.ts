import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DatepickerComponent } from './datepicker.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DatepickerComponent,
      },
    ]),
  ],
})
export class DatepickerRoutingModule {}
