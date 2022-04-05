import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PhoneFieldComponent } from './phone-field.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PhoneFieldComponent,
      },
    ]),
  ],
})
export class PhoneFieldRoutingModule {}
