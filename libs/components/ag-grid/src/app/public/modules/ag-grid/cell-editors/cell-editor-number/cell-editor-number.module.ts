import {
  NgModule
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyAgGridResourcesModule
} from '../../../shared';

import {
  SkyAgGridCellEditorNumberComponent
} from '../cell-editor-number';

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
