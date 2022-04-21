import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyTilesModule } from '@skyux/tiles';

import { TileDemoTile1Component } from './tile-demo-tile1.component';
import { TileDemoTile2Component } from './tile-demo-tile2.component';
import { TilesDemoComponent } from './tiles-demo.component';

@NgModule({
  imports: [CommonModule, SkyTilesModule],
  declarations: [
    TilesDemoComponent,
    TileDemoTile1Component,
    TileDemoTile2Component,
  ],
  exports: [TilesDemoComponent],
})
export class TilesDemoModule {}
