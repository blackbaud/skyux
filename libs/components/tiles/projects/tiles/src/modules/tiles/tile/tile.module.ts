import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyI18nModule } from '@skyux/i18n';

import { SkyChevronModule, SkyIconModule } from '@skyux/indicators';

import { SkyThemeModule } from '@skyux/theme';

import { SkyTilesResourcesModule } from '../../shared/sky-tiles-resources.module';

import { SkyTileComponent } from './tile.component';

import { SkyTileSummaryComponent } from './tile-summary.component';

import { SkyTileTitleComponent } from './tile-title.component';

@NgModule({
  declarations: [
    SkyTileComponent,
    SkyTileSummaryComponent,
    SkyTileTitleComponent,
  ],
  imports: [
    CommonModule,
    SkyChevronModule,
    SkyI18nModule,
    SkyIconModule,
    SkyThemeModule,
    SkyTilesResourcesModule,
  ],
  exports: [SkyTileComponent, SkyTileSummaryComponent, SkyTileTitleComponent],
})
export class SkyTileModule {}
