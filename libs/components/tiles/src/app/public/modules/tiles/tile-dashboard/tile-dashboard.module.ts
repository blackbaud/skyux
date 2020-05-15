import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragulaService } from 'ng2-dragula';

import { SkyTileDashboardComponent } from './tile-dashboard.component';
import { SkyTileDashboardColumnModule } from '../tile-dashboard-column/tile-dashboard-column.module';

import {
  SkyMediaQueryModule,
  SkyUIConfigService
} from '@skyux/core';

@NgModule({
  declarations: [
    SkyTileDashboardComponent
  ],
  providers: [
    DragulaService,
    SkyUIConfigService
  ],
  imports: [
    CommonModule,
    SkyTileDashboardColumnModule,
    SkyMediaQueryModule
  ],
  exports: [
    SkyTileDashboardComponent
  ]
})
export class SkyTileDashboardModule { }
