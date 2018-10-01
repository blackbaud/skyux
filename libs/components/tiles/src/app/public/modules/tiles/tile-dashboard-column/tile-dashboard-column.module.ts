import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { SkyTileDashboardColumnComponent } from './tile-dashboard-column.component';

@NgModule({
  declarations: [
    SkyTileDashboardColumnComponent
  ],
  imports: [
    CommonModule,
    DragulaModule
  ],
  exports: [
    SkyTileDashboardColumnComponent
  ]
})
export class SkyTileDashboardColumnModule { }
