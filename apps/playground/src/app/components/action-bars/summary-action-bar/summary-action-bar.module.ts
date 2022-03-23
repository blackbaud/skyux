import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkySummaryActionBarModule } from '@skyux/action-bars';
import { SkyKeyInfoModule } from '@skyux/indicators';
import { SkyModalModule } from '@skyux/modals';

import { SummaryActionBarModalComponent } from './summary-action-bar-modal.component';
import { SummaryActionBarRoutingModule } from './summary-action-bar-routing.module';
import { SummaryActionBarComponent } from './summary-action-bar.component';

@NgModule({
  declarations: [SummaryActionBarComponent, SummaryActionBarModalComponent],
  imports: [
    CommonModule,
    SkyKeyInfoModule,
    SkyModalModule,
    SkySummaryActionBarModule,
    SummaryActionBarRoutingModule,
  ],
})
export class SummaryActionBarModule {}
