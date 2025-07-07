import { NgModule } from '@angular/core';

import { SkyFilterBarSummaryItemComponent } from './filter-bar-summary-item.component';
import { SkyFilterBarSummaryComponent } from './filter-bar-summary.component';
import { SkyFilterBarComponent } from './filter-bar.component';

@NgModule({
  imports: [
    SkyFilterBarComponent,
    SkyFilterBarSummaryComponent,
    SkyFilterBarSummaryItemComponent,
  ],
  exports: [
    SkyFilterBarComponent,
    SkyFilterBarSummaryComponent,
    SkyFilterBarSummaryItemComponent,
  ],
})
export class SkyFilterBarModule {}
