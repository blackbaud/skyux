import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyAutonumericModule } from '@skyux/autonumeric';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';

import { SkyAgGridCellEditorCurrencyComponent } from './cell-editor-currency.component';

@NgModule({
  imports: [SkyAgGridResourcesModule, FormsModule, SkyAutonumericModule],
  declarations: [SkyAgGridCellEditorCurrencyComponent],
  exports: [SkyAgGridCellEditorCurrencyComponent],
})
export class SkyAgGridCellEditorCurrencyModule {}
