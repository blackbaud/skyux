import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StachePageAnchorComponent } from './page-anchor.component';
import { StachePageAnchorService } from './page-anchor.service';

@NgModule({
  declarations: [
    StachePageAnchorComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    StachePageAnchorService
  ],
  exports: [
    StachePageAnchorComponent
  ]
})
export class StachePageAnchorModule { }
