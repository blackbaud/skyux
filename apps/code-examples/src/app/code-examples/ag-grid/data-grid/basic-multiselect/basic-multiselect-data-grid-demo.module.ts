import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';

import { AgGridModule } from 'ag-grid-angular';

import { BasicMultiselectDataGridDemoComponent } from './basic-multiselect-data-grid-demo.component';

@NgModule({
  declarations: [BasicMultiselectDataGridDemoComponent],
  exports: [BasicMultiselectDataGridDemoComponent],
  imports: [AgGridModule, SkyAgGridModule],
})
export class BasicMultiselectDataGridDemoModule {}
