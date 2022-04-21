import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAutocompleteModule } from '@skyux/lookup';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellEditorAutocompleteComponent } from '../cell-editor-autocomplete/cell-editor-autocomplete.component';

@NgModule({
  imports: [FormsModule, SkyAgGridResourcesModule, SkyAutocompleteModule],
  declarations: [SkyAgGridCellEditorAutocompleteComponent],
  exports: [SkyAgGridCellEditorAutocompleteComponent],
})
export class SkyAgGridCellEditorAutocompleteModule {}
