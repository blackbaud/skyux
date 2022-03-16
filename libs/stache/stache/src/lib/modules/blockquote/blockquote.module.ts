import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheBlockquoteComponent } from './blockquote.component';

@NgModule({
  declarations: [StacheBlockquoteComponent],
  imports: [CommonModule],
  exports: [StacheBlockquoteComponent],
})
export class StacheBlockquoteModule {}
