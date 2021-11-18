import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyTilesModule } from 'projects/tiles/src/public-api';

import { TilesDemoComponent } from './tiles-demo.component';

import { TileDemoTile1Component } from './tile-demo-tile1.component';

import { TileDemoTile2Component } from './tile-demo-tile2.component';

@NgModule({
  imports: [CommonModule, SkyTilesModule],
  declarations: [
    TilesDemoComponent,
    TileDemoTile1Component,
    TileDemoTile2Component,
  ],
  exports: [TilesDemoComponent],
  entryComponents: [TileDemoTile1Component, TileDemoTile2Component],
})
export class TilesDemoModule {}
