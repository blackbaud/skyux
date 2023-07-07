import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkySelectionModalModule } from '@skyux/lookup';
import { SkyModalModule } from '@skyux/modals';

import { SelectionModalDemoAddItemComponent } from './selection-modal-demo-add-item.component';
import { SelectionModalDemoComponent } from './selection-modal-demo.component';

@NgModule({
  declarations: [
    SelectionModalDemoAddItemComponent,
    SelectionModalDemoComponent,
  ],
  exports: [SelectionModalDemoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkySelectionModalModule,
  ],
})
export class SelectionModalDemoModule {}
