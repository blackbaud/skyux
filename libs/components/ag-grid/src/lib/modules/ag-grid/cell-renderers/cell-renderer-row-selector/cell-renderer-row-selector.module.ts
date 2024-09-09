import { AsyncPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyCheckboxModule } from '@skyux/forms';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellRendererRowSelectorComponent } from '../cell-renderer-row-selector/cell-renderer-row-selector.component';

@NgModule({
  imports: [AsyncPipe, SkyAgGridResourcesModule, SkyCheckboxModule],
  declarations: [SkyAgGridCellRendererRowSelectorComponent],
  exports: [SkyAgGridCellRendererRowSelectorComponent],
})
export class SkyAgGridCellRendererRowSelectorModule {}
