import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyTileContentSectionComponent } from './tile-content-section.component';
import { SkyTileContentComponent } from './tile-content.component';

@NgModule({
  declarations: [
    SkyTileContentComponent,
    SkyTileContentSectionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyTileContentComponent,
    SkyTileContentSectionComponent
  ]
})
export class SkyTileContentModule { }
