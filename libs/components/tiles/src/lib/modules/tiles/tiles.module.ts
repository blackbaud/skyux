import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyTileModule } from './tile/tile.module';
import { SkyTileContentModule } from './tile-content/tile-content.module';
import { SkyTileDashboardModule } from './tile-dashboard/tile-dashboard.module';
import { SkyTileDashboardColumnModule } from './tile-dashboard-column/tile-dashboard-column.module';

@NgModule({
  imports: [CommonModule],
  exports: [
    SkyTileContentModule,
    SkyTileModule,
    SkyTileDashboardColumnModule,
    SkyTileDashboardModule,
  ],
})
export class SkyTilesModule {}
