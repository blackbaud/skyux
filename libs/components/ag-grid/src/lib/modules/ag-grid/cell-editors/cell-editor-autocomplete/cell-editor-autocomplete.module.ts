import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellEditorAutocompleteComponent } from '../cell-editor-autocomplete/cell-editor-autocomplete.component';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SkyAgGridResourcesModule,
    SkyAutocompleteModule,
    SkyIdModule,
  ],
  declarations: [SkyAgGridCellEditorAutocompleteComponent],
  exports: [SkyAgGridCellEditorAutocompleteComponent],
})
export class SkyAgGridCellEditorAutocompleteModule {}
