import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyAutonumericModule } from '@skyux/autonumeric';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';

import { SkyAgGridCellEditorCurrencyComponent } from './cell-editor-currency.component';

@NgModule({
  imports: [
    SkyAgGridResourcesModule,
    ReactiveFormsModule,
    SkyAutonumericModule,
  ],
  declarations: [SkyAgGridCellEditorCurrencyComponent],
  exports: [SkyAgGridCellEditorCurrencyComponent],
})
export class SkyAgGridCellEditorCurrencyModule {}
