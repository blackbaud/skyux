import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  AgGridResourcesModule
} from '../../../shared/ag-grid-resources.module';

import {
  SkyAgGridCellEditorTextComponent
} from './cell-editor-text.component';

@NgModule({
  imports: [
    AgGridResourcesModule,
    FormsModule
  ],
  declarations: [
    SkyAgGridCellEditorTextComponent
  ],
  exports: [
    SkyAgGridCellEditorTextComponent
  ]
})
export class SkyAgGridCellEditorTextModule {
}
