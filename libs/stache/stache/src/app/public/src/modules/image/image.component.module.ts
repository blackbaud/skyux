import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheImageComponent } from './image.component';

@NgModule({
  declarations: [
    StacheImageComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheImageComponent
  ]
})
export class StacheImageModule { }
