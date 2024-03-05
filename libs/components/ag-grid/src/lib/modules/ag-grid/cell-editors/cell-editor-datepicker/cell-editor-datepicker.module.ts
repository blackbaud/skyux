import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellEditorDatepickerComponent } from '../cell-editor-datepicker/cell-editor-datepicker.component';

@NgModule({
  imports: [SkyAgGridResourcesModule, SkyDatepickerModule, ReactiveFormsModule],
  declarations: [SkyAgGridCellEditorDatepickerComponent],
  exports: [SkyAgGridCellEditorDatepickerComponent],
})
export class SkyAgGridCellEditorDatepickerModule {}
