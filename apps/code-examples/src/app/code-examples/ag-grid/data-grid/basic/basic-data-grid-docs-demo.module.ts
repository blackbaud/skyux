import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';

import { AgGridModule } from 'ag-grid-angular';

import { BasicDataGridDemoComponent } from './basic-data-grid-docs-demo.component';

@NgModule({
  declarations: [BasicDataGridDemoComponent],
  exports: [BasicDataGridDemoComponent],
  imports: [AgGridModule, SkyAgGridModule],
})
export class BasicDataGridDemoModule {}
