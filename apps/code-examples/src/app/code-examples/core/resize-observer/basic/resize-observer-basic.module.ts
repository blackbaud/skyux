import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ResizeObserverBasicComponent } from './resize-observer-basic.component';

@NgModule({
  declarations: [ResizeObserverBasicComponent],
  imports: [CommonModule],
  exports: [ResizeObserverBasicComponent],
})
export class ResizeObserverBasicModule {}
