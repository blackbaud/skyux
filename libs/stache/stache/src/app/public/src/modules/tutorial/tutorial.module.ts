import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheTutorialHeadingComponent } from './tutorial-heading.component';
import { StacheTutorialBodyComponent } from './tutorial-body.component';
import { StacheTutorialComponent } from './tutorial.component';

@NgModule({
  declarations: [
    StacheTutorialComponent,
    StacheTutorialHeadingComponent,
    StacheTutorialBodyComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheTutorialComponent,
    StacheTutorialHeadingComponent,
    StacheTutorialBodyComponent
  ]
})
export class StacheTutorialModule { }
