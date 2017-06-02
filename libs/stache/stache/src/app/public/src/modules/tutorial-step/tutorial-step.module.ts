import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheTutorialStepComponent } from './tutorial-step.component';
import { StacheTutorialStepBodyComponent } from './tutorial-step-body.component';
import { StacheTutorialStepHeadingComponent } from './tutorial-step-heading.component';

@NgModule({
  declarations: [
    StacheTutorialStepComponent,
    StacheTutorialStepBodyComponent,
    StacheTutorialStepHeadingComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheTutorialStepComponent,
    StacheTutorialStepBodyComponent,
    StacheTutorialStepHeadingComponent
  ]
})
export class StacheTutorialStepModule { }
