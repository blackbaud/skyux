import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';

import { SkyTopScrollDataGridDemoComponent } from './top-scroll-data-grid-demo.component';

@NgModule({
  declarations: [SkyTopScrollDataGridDemoComponent],
  exports: [SkyTopScrollDataGridDemoComponent],
  imports: [
    CommonModule,
    SkyToolbarModule,
    SkySearchModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
  ],
  providers: [SkyDataManagerService],
})
export class SkyTopScrollDataGridDemoModule {}
