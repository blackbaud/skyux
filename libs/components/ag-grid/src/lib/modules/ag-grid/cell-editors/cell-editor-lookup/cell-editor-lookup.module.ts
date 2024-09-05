import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyLookupModule } from '@skyux/lookup';

import { SkyAgGridCellEditorLookupComponent } from './cell-editor-lookup.component';

@NgModule({
  declarations: [SkyAgGridCellEditorLookupComponent],
  exports: [SkyAgGridCellEditorLookupComponent],
  imports: [
    ReactiveFormsModule,
    SkyIdModule,
    SkyInputBoxModule,
    SkyLookupModule,
  ],
})
export class SkyAgGridCellEditorLookupModule {}
