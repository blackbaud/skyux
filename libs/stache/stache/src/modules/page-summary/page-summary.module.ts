import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StachePageSummaryComponent } from './page-summary.component';

@NgModule({
  declarations: [
    StachePageSummaryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StachePageSummaryComponent
  ]
})
export class StachePageSummaryModule { }
