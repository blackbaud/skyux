import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { AgGridModule } from 'ag-grid-angular';

import { DataGridDemoComponent } from './data-grid-demo.component';
import { InlineHelpComponent } from './inline-help.component';

@NgModule({
  declarations: [DataGridDemoComponent, InlineHelpComponent],
  exports: [DataGridDemoComponent],
  imports: [
    CommonModule,
    SkyToolbarModule,
    SkySearchModule,
    SkyDataManagerModule,
    SkyAgGridModule,
    AgGridModule,
    SkyHelpInlineModule,
  ],
  providers: [SkyDataManagerService],
})
export class DataGridDemoModule {}
