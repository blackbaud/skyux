import { NgModule } from '@angular/core';

import { SkyFilterBarSummaryComponent } from './filter-bar-summary.component';
import { SkyFilterBarComponent } from './filter-bar.component';

@NgModule({
  imports: [SkyFilterBarComponent, SkyFilterBarSummaryComponent],
  exports: [SkyFilterBarComponent, SkyFilterBarSummaryComponent],
})
export class SkyFilterBarModule {}
