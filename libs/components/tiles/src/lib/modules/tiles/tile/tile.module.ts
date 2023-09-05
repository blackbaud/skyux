import { NgModule } from '@angular/core';

import { SkyTileSummaryComponent } from './tile-summary.component';
import { SkyTileTitleComponent } from './tile-title.component';
import { SkyTileComponent } from './tile.component';

@NgModule({
  imports: [SkyTileComponent, SkyTileSummaryComponent, SkyTileTitleComponent],
  exports: [SkyTileComponent, SkyTileSummaryComponent, SkyTileTitleComponent],
})
export class SkyTileModule {}
