import { NgModule } from '@angular/core';

import { SkyAgGridResourcesModule } from '../../../shared/sky-ag-grid-resources.module';

import { SkyAgGridCellRendererLookupComponent } from './cell-renderer-lookup.component';

@NgModule({
  declarations: [SkyAgGridCellRendererLookupComponent],
  exports: [SkyAgGridCellRendererLookupComponent],
  imports: [SkyAgGridResourcesModule],
})
export class SkyAgGridCellRendererLookupModule {}
