import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheVideoComponent } from './video.component';

@NgModule({
  declarations: [
    StacheVideoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheVideoComponent
  ]
})
export class StacheVideoModule { }
