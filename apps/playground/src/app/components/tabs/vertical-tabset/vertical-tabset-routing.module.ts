import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VerticalTabsetComponent } from './vertical-tabset.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: VerticalTabsetComponent,
      },
    ]),
  ],
})
export class VerticalTabsetRoutingModule {}
