import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SkyTileModule } from './tile';
import { SkyTileContentModule } from './tile-content';
import { SkyTileDashboardModule } from './tile-dashboard';
import { SkyTileDashboardColumnModule } from './tile-dashboard-column';

@NgModule({
  imports: [
    BrowserAnimationsModule
  ],
  exports: [
    SkyTileContentModule,
    SkyTileModule,
    SkyTileDashboardColumnModule,
    SkyTileDashboardModule
  ]
})
export class SkyTilesModule { }
