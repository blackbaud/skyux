import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyTilesModule } from '@skyux/tiles';

import { Tile1Component } from './tile1/tile1.component';
import { Tile2Component } from './tile2/tile2.component';
import { TileDashboardComponent } from './tile-dashboard.component';

const routes: Routes = [{ path: '', component: TileDashboardComponent }];
@NgModule({
  declarations: [TileDashboardComponent, Tile1Component, Tile2Component],
  imports: [CommonModule, RouterModule.forChild(routes), SkyTilesModule],
  exports: [TileDashboardComponent],
})
export class TileDashboardModule {}
