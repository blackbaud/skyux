import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellEditorNumberComponent } from '../cell-editor-number/cell-editor-number.component';

@NgModule({
  imports: [SkyAgGridResourcesModule, ReactiveFormsModule],
  declarations: [SkyAgGridCellEditorNumberComponent],
  exports: [SkyAgGridCellEditorNumberComponent],
})
export class SkyAgGridCellEditorNumberModule {}
