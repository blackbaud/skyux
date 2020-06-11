import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAutocompleteModule
} from '@skyux/lookup';

import {
  SkyAgGridCellEditorAutocompleteComponent
} from '../cell-editor-autocomplete/cell-editor-autocomplete.component';

import {
  SkyAgGridResourcesModule
} from '../../../shared/ag-grid-resources.module';

@NgModule({
  imports: [
    FormsModule,
    SkyAgGridResourcesModule,
    SkyAutocompleteModule
  ],
  declarations: [
    SkyAgGridCellEditorAutocompleteComponent
  ],
  exports: [
    SkyAgGridCellEditorAutocompleteComponent
  ]
})
export class SkyAgGridCellEditorAutocompleteModule {
}
