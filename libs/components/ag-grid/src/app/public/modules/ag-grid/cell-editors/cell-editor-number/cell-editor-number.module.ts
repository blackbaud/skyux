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
  SkyAgGridCellEditorNumberComponent
} from '../cell-editor-number/cell-editor-number.component';

@NgModule({
  imports: [
    SkyAgGridResourcesModule,
    FormsModule
  ],
  declarations: [
    SkyAgGridCellEditorNumberComponent
  ],
  exports: [
    SkyAgGridCellEditorNumberComponent
  ]
})
export class SkyAgGridCellEditorNumberModule {
}
