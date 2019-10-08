import {
  NgModule
} from '@angular/core';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyAgGridService
} from './ag-grid.service';

import {
  SkyAgGridCellEditorAutocompleteComponent,
  SkyAgGridCellEditorAutocompleteModule,
  SkyAgGridCellEditorDatepickerComponent,
  SkyAgGridCellEditorDatepickerModule,
  SkyAgGridCellEditorNumberComponent,
  SkyAgGridCellEditorNumberModule
} from './cell-editors';

import {
  SkyAgGridCellRendererRowSelectorComponent,
  SkyAgGridCellRendererRowSelectorModule
} from './cell-renderers';

@NgModule({
  declarations: [],
  imports: [
    AgGridModule,
    SkyAgGridCellEditorAutocompleteModule,
    SkyAgGridCellEditorDatepickerModule,
    SkyAgGridCellEditorNumberModule,
    SkyAgGridCellRendererRowSelectorModule
  ],
  providers: [
    SkyAgGridService
  ],
  entryComponents: [
    SkyAgGridCellEditorAutocompleteComponent,
    SkyAgGridCellEditorDatepickerComponent,
    SkyAgGridCellEditorNumberComponent,
    SkyAgGridCellRendererRowSelectorComponent
  ]
})
export class SkyAgGridModule { }
