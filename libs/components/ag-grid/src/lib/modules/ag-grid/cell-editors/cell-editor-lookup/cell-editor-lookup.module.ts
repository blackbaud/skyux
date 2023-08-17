import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { SkyAgGridCellEditorLookupComponent } from './cell-editor-lookup.component';

@NgModule({
  declarations: [SkyAgGridCellEditorLookupComponent],
  exports: [SkyAgGridCellEditorLookupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class SkyAgGridCellEditorLookupModule {}
