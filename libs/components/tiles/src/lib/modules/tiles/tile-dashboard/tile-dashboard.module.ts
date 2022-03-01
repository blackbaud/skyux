import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { SkyTilesResourcesModule } from '../../shared/sky-tiles-resources.module';
import { SkyTileDashboardColumnModule } from '../tile-dashboard-column/tile-dashboard-column.module';

import { SkyTileDashboardComponent } from './tile-dashboard.component';

@NgModule({
  declarations: [SkyTileDashboardComponent],
  providers: [DragulaService],
  imports: [
    CommonModule,
    SkyTileDashboardColumnModule,
    SkyTilesResourcesModule,
  ],
  exports: [SkyTileDashboardComponent],
})
export class SkyTileDashboardModule {}
