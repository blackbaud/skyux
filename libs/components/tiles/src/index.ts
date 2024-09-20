export { SkyTileModule } from './lib/modules/tiles/tile/tile.module';

export { SkyTileContentModule } from './lib/modules/tiles/tile-content/tile-content.module';

export type { SkyTileDashboardMessage } from './lib/modules/tiles/tile-dashboard/tile-dashboard-message';
export { SkyTileDashboardMessageType } from './lib/modules/tiles/tile-dashboard/tile-dashboard-message-type';
export { SkyTileDashboardModule } from './lib/modules/tiles/tile-dashboard/tile-dashboard.module';
export { SkyTileDashboardService } from './lib/modules/tiles/tile-dashboard/tile-dashboard.service';

export { SkyTileDashboardColumnModule } from './lib/modules/tiles/tile-dashboard-column/tile-dashboard-column.module';

export type { SkyTileDashboardConfig } from './lib/modules/tiles/tile-dashboard-config/tile-dashboard-config';
export type { SkyTileDashboardConfigLayout } from './lib/modules/tiles/tile-dashboard-config/tile-dashboard-config-layout';
export type { SkyTileDashboardConfigLayoutColumn } from './lib/modules/tiles/tile-dashboard-config/tile-dashboard-config-layout-column';
export type { SkyTileDashboardConfigLayoutTile } from './lib/modules/tiles/tile-dashboard-config/tile-dashboard-config-layout-tile';
export type { SkyTileDashboardConfigReorderData } from './lib/modules/tiles/tile-dashboard-config/tile-dashboard-config-reorder-data';
export type { SkyTileDashboardConfigTile } from './lib/modules/tiles/tile-dashboard-config/tile-dashboard-config-tile';

export { SkyTilesModule } from './lib/modules/tiles/tiles.module';

// Components and directives must be exported to support Angular’s “partial” Ivy compiler.
// Obscure names are used to indicate types are not part of the public API.
export { SkyTileContentSectionComponent as λ4 } from './lib/modules/tiles/tile-content/tile-content-section.component';
export { SkyTileContentComponent as λ5 } from './lib/modules/tiles/tile-content/tile-content.component';
export { SkyTileDashboardColumnComponent as λ6 } from './lib/modules/tiles/tile-dashboard-column/tile-dashboard-column.component';
export { SkyTileDashboardComponent as λ7 } from './lib/modules/tiles/tile-dashboard/tile-dashboard.component';
export { SkyTileSummaryComponent as λ2 } from './lib/modules/tiles/tile/tile-summary.component';
export { SkyTileTitleComponent as λ3 } from './lib/modules/tiles/tile/tile-title.component';
export { SkyTileComponent as λ1 } from './lib/modules/tiles/tile/tile.component';
