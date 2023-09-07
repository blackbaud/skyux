import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyDataManagerService } from '@skyux/data-manager';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';

import { DataGridDemoComponent } from './data-grid-demo.component';

@NgModule({
  declarations: [DataGridDemoComponent],
  exports: [DataGridDemoComponent],
  imports: [AgGridModule, SkyAgGridModule, SkySearchModule, SkyToolbarModule],
  providers: [SkyDataManagerService],
})
export class DataGridDemoModule {}
