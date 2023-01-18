import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkySelectionModalModule } from '@skyux/lookup';

import { SelectionModalDemoComponent } from './selection-modal-demo.component';

@NgModule({
  declarations: [SelectionModalDemoComponent],
  exports: [SelectionModalDemoComponent],
  imports: [CommonModule, SkySelectionModalModule],
})
export class SelectionModalDemoModule {}
