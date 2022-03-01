import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridResourcesModule } from '../../../shared/ag-grid-resources.module';

import { SkyAgGridCellRendererLookupComponent } from './cell-renderer-lookup.component';

@NgModule({
  declarations: [SkyAgGridCellRendererLookupComponent],
  exports: [SkyAgGridCellRendererLookupComponent],
  imports: [CommonModule, AgGridResourcesModule],
})
export class SkyAgGridCellRendererLookupModule {}
