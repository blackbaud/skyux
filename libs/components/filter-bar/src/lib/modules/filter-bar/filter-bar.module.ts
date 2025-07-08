import { NgModule } from '@angular/core';

import { SkyFilterBarSummaryItemComponent } from './filter-bar-summary-item.component';
import { SkyFilterBarSummaryComponent } from './filter-bar-summary.component';
import { SkyFilterBarComponent } from './filter-bar.component';
import { SkyFilterItemModalComponent } from './filter-item-modal.component';

@NgModule({
  imports: [SkyFilterBarComponent, SkyFilterItemModalComponent],
  exports: [SkyFilterBarComponent, SkyFilterItemModalComponent],
})
export class SkyFilterBarModule {}
