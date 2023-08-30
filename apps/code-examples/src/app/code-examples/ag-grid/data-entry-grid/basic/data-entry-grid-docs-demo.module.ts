import { NgModule } from '@angular/core';
import { SkyAgGridModule } from '@skyux/ag-grid';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridModule } from 'ag-grid-angular';

import { SkyDataEntryGridDemoComponent } from './data-entry-grid-docs-demo.component';

@NgModule({
  declarations: [SkyDataEntryGridDemoComponent],
  imports: [
    SkyToolbarModule,
    SkySearchModule,
    AgGridModule,
    SkyAgGridModule,
    SkyDropdownModule,
  ],
  exports: [SkyDataEntryGridDemoComponent],
})
export class SkyDataEntryGridDocsDemoModule {}
