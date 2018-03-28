import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StachePageAnchorComponent } from './page-anchor.component';

import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StachePageAnchorComponent
  ],
  imports: [
    CommonModule,
    StacheLinkModule,
    RouterModule
  ],
  exports: [
    StachePageAnchorComponent
  ]
})
export class StachePageAnchorModule { }
