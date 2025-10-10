import { NgModule } from '@angular/core';

import { SkyListSummaryItemComponent } from './list-summary-item.component';
import { SkyListSummaryComponent } from './list-summary.component';

@NgModule({
  imports: [SkyListSummaryComponent, SkyListSummaryItemComponent],
  exports: [SkyListSummaryComponent, SkyListSummaryItemComponent],
})
export class SkyListSummaryModule {}
