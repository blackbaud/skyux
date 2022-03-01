import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { AgGridResourcesModule } from '../../../shared/ag-grid-resources.module';
import { SkyAgGridCellEditorAutocompleteComponent } from '../cell-editor-autocomplete/cell-editor-autocomplete.component';

@NgModule({
  imports: [FormsModule, AgGridResourcesModule, SkyAutocompleteModule],
  declarations: [SkyAgGridCellEditorAutocompleteComponent],
  exports: [SkyAgGridCellEditorAutocompleteComponent],
})
export class SkyAgGridCellEditorAutocompleteModule {}
