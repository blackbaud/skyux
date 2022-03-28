import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabsSummaryActionBarComponent } from './tabs-summary-action-bar.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TabsSummaryActionBarComponent,
      },
    ]),
  ],
})
export class TabsSummaryActionBarRoutingModule {}
