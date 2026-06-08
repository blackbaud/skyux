import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyPageSummaryModule } from '../page-summary.module';

import { SkyPageSummaryTestComponent } from './page-summary.component.fixture';

@NgModule({
  declarations: [SkyPageSummaryTestComponent],
  imports: [CommonModule, SkyPageSummaryModule],
  exports: [SkyPageSummaryTestComponent],
})
export class SkyPageSummaryFixturesModule {}
