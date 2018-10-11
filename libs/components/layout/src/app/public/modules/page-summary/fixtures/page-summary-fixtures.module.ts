import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyPageSummaryModule } from '../';

import { SkyPageSummaryTestComponent } from './page-summary.component.fixture';

@NgModule({
  declarations: [
    SkyPageSummaryTestComponent
  ],
  imports: [
    CommonModule,
    SkyPageSummaryModule
  ],
  exports: [
    SkyPageSummaryTestComponent
  ]
})
export class SkyPageSummaryFixturesModule { }
