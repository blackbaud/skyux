import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';

import { DataEntryGridDemoComponent } from './data-entry-grid-demo.component';

@NgModule({
  declarations: [DataEntryGridDemoComponent],
  imports: [AgGridModule, SkyAgGridModule, SkySearchModule, SkyToolbarModule],
  exports: [DataEntryGridDemoComponent],
})
export class DataEntryGridDemoModule {}
