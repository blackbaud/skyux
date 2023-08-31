import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DragulaService } from 'ng2-dragula';

import { SkyTilesResourcesModule } from '../../shared/sky-tiles-resources.module';
import { SkyTileDashboardColumnComponent } from '../tile-dashboard-column/tile-dashboard-column.component';

import { SkyTileDashboardComponent } from './tile-dashboard.component';

@NgModule({
  declarations: [SkyTileDashboardComponent],
  providers: [DragulaService],
  imports: [
    CommonModule,
    SkyTileDashboardColumnComponent,
    SkyTilesResourcesModule,
  ],
  exports: [SkyTileDashboardComponent],
})
export class SkyTileDashboardModule {}
