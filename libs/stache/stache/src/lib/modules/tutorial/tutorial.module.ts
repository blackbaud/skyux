import { NgModule } from '@angular/core';

import { StacheTutorialStepModule } from '../tutorial-step/tutorial-step.module';

import { StacheTutorialHeadingComponent } from './tutorial-heading.component';
import { StacheTutorialSummaryComponent } from './tutorial-summary.component';
import { StacheTutorialComponent } from './tutorial.component';

@NgModule({
  declarations: [
    StacheTutorialComponent,
    StacheTutorialHeadingComponent,
    StacheTutorialSummaryComponent,
  ],
  exports: [
    StacheTutorialComponent,
    StacheTutorialHeadingComponent,
    StacheTutorialSummaryComponent,
    StacheTutorialStepModule,
  ],
})
export class StacheTutorialModule {}
