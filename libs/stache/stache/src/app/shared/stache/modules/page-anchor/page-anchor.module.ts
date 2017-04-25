import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StachePageAnchorComponent } from './page-anchor.component';

@NgModule({
  declarations: [
    StachePageAnchorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StachePageAnchorComponent
  ]
})
export class StachePageAnchorModule { }
