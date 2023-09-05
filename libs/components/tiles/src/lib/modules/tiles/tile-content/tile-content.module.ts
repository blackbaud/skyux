import { NgModule } from '@angular/core';

import { SkyTileContentSectionComponent } from './tile-content-section.component';
import { SkyTileContentComponent } from './tile-content.component';

@NgModule({
  imports: [SkyTileContentComponent, SkyTileContentSectionComponent],
  exports: [SkyTileContentComponent, SkyTileContentSectionComponent],
})
export class SkyTileContentModule {}
