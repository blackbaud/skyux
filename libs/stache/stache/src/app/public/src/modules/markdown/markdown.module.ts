import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheMarkdownComponent } from './markdown.component';

@NgModule({
  declarations: [
    StacheMarkdownComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheMarkdownComponent
  ]
})
export class StacheMarkdownModule { }
