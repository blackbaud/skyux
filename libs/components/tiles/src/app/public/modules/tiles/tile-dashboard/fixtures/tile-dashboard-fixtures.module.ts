import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyTilesModule } from '../..';
import { Tile1TestComponent } from './tile1.component.fixture';
import { Tile2TestComponent } from './tile2.component.fixture';
import { TileDashboardTestComponent } from './tile-dashboard.component.fixture';
import { TileDashboardOnPushTestComponent } from './tile-dashboard-on-push.component.fixture';

@NgModule({
  declarations: [
    Tile1TestComponent,
    Tile2TestComponent,
    TileDashboardTestComponent,
    TileDashboardOnPushTestComponent
  ],
  imports: [
    CommonModule,
    SkyTilesModule
  ],
  exports: [
    Tile1TestComponent,
    Tile2TestComponent,
    TileDashboardTestComponent,
    TileDashboardOnPushTestComponent
  ],
  entryComponents: [
    Tile1TestComponent,
    Tile2TestComponent
  ]
})
export class SkyTileDashboardFixturesModule { }
