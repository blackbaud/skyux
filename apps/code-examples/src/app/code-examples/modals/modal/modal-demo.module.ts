import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalDemoComponent } from './modal-demo.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ModalDemoComponent],
  exports: [ModalDemoComponent],
})
export class ModalDemoModule {}
