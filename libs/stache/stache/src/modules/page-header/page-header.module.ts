import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StachePageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [
    StachePageHeaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StachePageHeaderComponent
  ]
})
export class StachePageHeaderModule { }
