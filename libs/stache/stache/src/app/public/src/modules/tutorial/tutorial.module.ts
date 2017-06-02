import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheTutorialHeadingComponent } from './tutorial-heading.component';
import { StacheTutorialSummaryComponent } from './tutorial-summary.component';
import { StacheTutorialComponent } from './tutorial.component';

@NgModule({
  declarations: [
    StacheTutorialComponent,
    StacheTutorialHeadingComponent,
    StacheTutorialSummaryComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheTutorialComponent,
    StacheTutorialHeadingComponent,
    StacheTutorialSummaryComponent
  ]
})
export class StacheTutorialModule { }
