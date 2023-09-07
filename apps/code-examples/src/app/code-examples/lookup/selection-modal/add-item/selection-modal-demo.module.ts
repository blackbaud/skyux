import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SelectionModalDemoComponent } from './selection-modal-demo.component';

@NgModule({
  declarations: [SelectionModalDemoComponent],
  exports: [SelectionModalDemoComponent],
  imports: [CommonModule],
})
export class SelectionModalDemoModule {}
