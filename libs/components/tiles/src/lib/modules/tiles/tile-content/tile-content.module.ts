import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyThemeModule } from '@skyux/theme';

import { SkyTileContentSectionComponent } from './tile-content-section.component';

import { SkyTileContentComponent } from './tile-content.component';

@NgModule({
  declarations: [SkyTileContentComponent, SkyTileContentSectionComponent],
  imports: [CommonModule, SkyThemeModule],
  exports: [SkyTileContentComponent, SkyTileContentSectionComponent],
})
export class SkyTileContentModule {}
