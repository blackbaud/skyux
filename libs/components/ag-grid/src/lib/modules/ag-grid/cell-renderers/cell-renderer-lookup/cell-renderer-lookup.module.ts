import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';

import { SkyAgGridCellRendererLookupComponent } from './cell-renderer-lookup.component';

@NgModule({
  declarations: [SkyAgGridCellRendererLookupComponent],
  exports: [SkyAgGridCellRendererLookupComponent],
  imports: [CommonModule, SkyAgGridResourcesModule],
})
export class SkyAgGridCellRendererLookupModule {}
