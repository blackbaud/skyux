import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SkyAutonumericModule } from '@skyux/autonumeric';

import { AgGridResourcesModule } from '../../../shared/ag-grid-resources.module';

import { SkyAgGridCellEditorCurrencyComponent } from './cell-editor-currency.component';

@NgModule({
  imports: [AgGridResourcesModule, FormsModule, SkyAutonumericModule],
  declarations: [SkyAgGridCellEditorCurrencyComponent],
  exports: [SkyAgGridCellEditorCurrencyComponent],
})
export class SkyAgGridCellEditorCurrencyModule {}
