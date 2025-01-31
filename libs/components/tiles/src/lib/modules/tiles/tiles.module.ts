import { NgModule } from '@angular/core';

import { SkyTileContentModule } from './tile-content/tile-content.module';
import { SkyTileDashboardColumnModule } from './tile-dashboard-column/tile-dashboard-column.module';
import { SkyTileDashboardModule } from './tile-dashboard/tile-dashboard.module';
import { SkyTileModule } from './tile/tile.module';

/**
 * @docsIncludeIds SkyTileComponent, SkyTileTitleComponent, SkyTileSummaryComponent, SkyTileContentComponent, SkyTileContentSectionComponent, SkyTileDashboardComponent, SkyTileDashboardService, SkyTileDashboardConfig, SkyTileDashboardConfigLayout, SkyTileDashboardConfigLayoutColumn, SkyTileDashboardConfigLayoutTile, SkyTileDashboardConfigTile, SkyTileDashboardConfigReorderData, SkyTileDashboardMessage, SkyTileDashboardMessageType, SkyTileHarness, SkyTileHarnessFilters, SkyTileContentHarness, SkyTileContentSectionHarness, SkyTileContentSectionHarnessFilters, SkyTileDashboardHarness, SkyTileDashboardHarnessFilters
 */
@NgModule({
  exports: [
    SkyTileContentModule,
    SkyTileModule,
    SkyTileDashboardColumnModule,
    SkyTileDashboardModule,
  ],
})
export class SkyTilesModule {}
