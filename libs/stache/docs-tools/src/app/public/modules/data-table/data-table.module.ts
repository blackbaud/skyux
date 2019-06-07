import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';
import { SkyDocsDataTableComponent } from './data-table.component';
import { SkyDocsDataTableColumnComponent } from './data-table-column.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SkyDocsDataTableColumnComponent,
    SkyDocsDataTableComponent
  ],
  exports: [
    SkyDocsDataTableColumnComponent,
    SkyDocsDataTableComponent
  ]
})
export class SkyDocsDataTableModule { }
