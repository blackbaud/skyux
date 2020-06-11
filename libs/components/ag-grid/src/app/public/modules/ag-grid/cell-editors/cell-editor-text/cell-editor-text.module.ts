import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAgGridResourcesModule
} from '../../../shared/ag-grid-resources.module';

import {
  SkyAgGridCellEditorTextComponent
} from './cell-editor-text.component';

@NgModule({
  imports: [
    SkyAgGridResourcesModule,
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
