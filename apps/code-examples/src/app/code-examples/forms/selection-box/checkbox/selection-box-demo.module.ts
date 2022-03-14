import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyCheckboxModule, SkySelectionBoxModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/indicators';

import { SelectionBoxDemoComponent } from './selection-box-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyIconModule,
    SkyIdModule,
    SkySelectionBoxModule,
  ],
  declarations: [SelectionBoxDemoComponent],
  exports: [SelectionBoxDemoComponent],
})
export class SkySelectionBoxDemoModule {}
