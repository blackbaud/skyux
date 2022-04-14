import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule } from '@skyux/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyChevronModule, SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyTilesResourcesModule } from '../../shared/sky-tiles-resources.module';

import { SkyTileSummaryComponent } from './tile-summary.component';
import { SkyTileTitleComponent } from './tile-title.component';
import { SkyTileComponent } from './tile.component';

@NgModule({
  declarations: [
    SkyTileComponent,
    SkyTileSummaryComponent,
    SkyTileTitleComponent,
  ],
  imports: [
    CommonModule,
    DragDropModule,
    SkyChevronModule,
    SkyIdModule,
    SkyI18nModule,
    SkyIconModule,
    SkyThemeModule,
    SkyTilesResourcesModule,
  ],
  exports: [SkyTileComponent, SkyTileSummaryComponent, SkyTileTitleComponent],
})
export class SkyTileModule {}
