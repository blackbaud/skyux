import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SummaryActionBarComponent } from './summary-action-bar.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SummaryActionBarComponent,
      },
    ]),
  ],
})
export class SummaryActionBarRoutingModule {}
