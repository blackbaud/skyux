import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';
import { StacheRouterModule } from '../router/router.module';

import { StacheTutorialStepBodyComponent } from './tutorial-step-body.component';
import { StacheTutorialStepHeadingComponent } from './tutorial-step-heading.component';
import { StacheTutorialStepComponent } from './tutorial-step.component';

@NgModule({
  declarations: [
    StacheTutorialStepComponent,
    StacheTutorialStepBodyComponent,
    StacheTutorialStepHeadingComponent,
  ],
  imports: [CommonModule, StachePageAnchorModule, StacheRouterModule],
  exports: [
    StacheTutorialStepComponent,
    StacheTutorialStepBodyComponent,
    StacheTutorialStepHeadingComponent,
  ],
})
export class StacheTutorialStepModule {}
