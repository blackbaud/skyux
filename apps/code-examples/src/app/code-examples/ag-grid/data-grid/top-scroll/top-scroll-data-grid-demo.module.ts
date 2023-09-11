import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';

import { TopScrollDataGridDemoComponent } from './top-scroll-data-grid-demo.component';

@NgModule({
  declarations: [TopScrollDataGridDemoComponent],
  exports: [TopScrollDataGridDemoComponent],
  imports: [AgGridModule, SkyAgGridModule, SkySearchModule, SkyToolbarModule],
})
export class TopScrollDataGridDemoModule {}
