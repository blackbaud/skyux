import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';
import { SkyAgGridCellRendererRowSelectorComponent } from '../cell-renderer-row-selector/cell-renderer-row-selector.component';

@NgModule({
  imports: [SkyAgGridResourcesModule, SkyCheckboxModule, FormsModule],
  declarations: [SkyAgGridCellRendererRowSelectorComponent],
  exports: [SkyAgGridCellRendererRowSelectorComponent],
})
export class SkyAgGridCellRendererRowSelectorModule {}
