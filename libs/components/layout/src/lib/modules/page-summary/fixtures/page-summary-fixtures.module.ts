import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SkyPageSummaryModule } from '../page-summary.module';

import { SkyPageSummaryTestComponent } from './page-summary.component.fixture';

@NgModule({
  declarations: [SkyPageSummaryTestComponent],
  imports: [CommonModule, NoopAnimationsModule, SkyPageSummaryModule],
  exports: [SkyPageSummaryTestComponent],
})
export class SkyPageSummaryFixturesModule {}
