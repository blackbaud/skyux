import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCoreAdapterModule,
  SkyViewkeeperModule
} from '@skyux/core';

import {
  AgGridModule
} from 'ag-grid-angular';

import {
  SkyDataManagerModule
} from '@skyux/data-manager';

import {
  SkyInlineDeleteModule
} from '@skyux/layout';

import {
  SkyAgGridService
} from './ag-grid.service';

import {
  SkyAgGridWrapperComponent
} from './ag-grid-wrapper.component';

import {
  SkyAgGridAdapterService
} from './ag-grid-adapter.service';

import {
  SkyAgGridCellEditorAutocompleteComponent
} from './cell-editors/cell-editor-autocomplete/cell-editor-autocomplete.component';

import {
  SkyAgGridCellEditorAutocompleteModule
} from './cell-editors/cell-editor-autocomplete/cell-editor-autocomplete.module';

import {
  SkyAgGridCellEditorDatepickerComponent
} from './cell-editors/cell-editor-datepicker/cell-editor-datepicker.component';

import {
  SkyAgGridCellEditorDatepickerModule
} from './cell-editors/cell-editor-datepicker/cell-editor-datepicker.module';

import {
  SkyAgGridCellEditorNumberComponent
} from './cell-editors/cell-editor-number/cell-editor-number.component';

import {
  SkyAgGridCellEditorNumberModule
} from './cell-editors/cell-editor-number/cell-editor-number.module';

import {
  SkyAgGridCellEditorTextComponent
} from './cell-editors/cell-editor-text/cell-editor-text.component';

import {
  SkyAgGridCellEditorTextModule
} from './cell-editors/cell-editor-text/cell-editor-text.module';

import {
  SkyAgGridCellRendererRowSelectorComponent
} from './cell-renderers/cell-renderer-row-selector/cell-renderer-row-selector.component';

import {
  SkyAgGridCellRendererRowSelectorModule
} from './cell-renderers/cell-renderer-row-selector/cell-renderer-row-selector.module';

import {
  SkyAgGridDataManagerAdapterDirective
} from './ag-grid-data-manager-adapter.directive';

import {
  SkyAgGridRowDeleteComponent
} from './ag-grid-row-delete.component';

import {
  SkyAgGridRowDeleteDirective
} from './ag-grid-row-delete.directive';

@NgModule({
  declarations: [
    SkyAgGridDataManagerAdapterDirective,
    SkyAgGridRowDeleteComponent,
    SkyAgGridRowDeleteDirective,
    SkyAgGridWrapperComponent
  ],
  imports: [
    AgGridModule,
    CommonModule,
    SkyAgGridCellEditorAutocompleteModule,
    SkyAgGridCellEditorDatepickerModule,
    SkyAgGridCellEditorNumberModule,
    SkyAgGridCellRendererRowSelectorModule,
    SkyAgGridCellEditorTextModule,
    SkyCoreAdapterModule,
    SkyDataManagerModule,
    SkyInlineDeleteModule,
    SkyViewkeeperModule
  ],
  exports: [
    SkyAgGridDataManagerAdapterDirective,
    SkyAgGridRowDeleteComponent,
    SkyAgGridRowDeleteDirective,
    SkyAgGridWrapperComponent
  ],
  providers: [
    SkyAgGridService,
    SkyAgGridAdapterService
  ],
  entryComponents: [
    SkyAgGridCellEditorAutocompleteComponent,
    SkyAgGridCellEditorDatepickerComponent,
    SkyAgGridCellEditorNumberComponent,
    SkyAgGridCellRendererRowSelectorComponent,
    SkyAgGridCellEditorTextComponent,
    SkyAgGridRowDeleteComponent
  ]
})
export class SkyAgGridModule { }
