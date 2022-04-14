import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyTileContentModule } from './tile-content/tile-content.module';
import { SkyTileDashboardModule } from './tile-dashboard/tile-dashboard.module';
import { SkyTileModule } from './tile/tile.module';

@NgModule({
  imports: [CommonModule],
  exports: [SkyTileContentModule, SkyTileModule, SkyTileDashboardModule],
})
export class SkyTilesModule {}
