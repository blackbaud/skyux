import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyTilesResourcesModule } from '../../shared/sky-tiles-resources.module';

import { SkyTileDashboardColumnComponent } from './tile-dashboard-column.component';
import { SkyTileDashboardComponent } from './tile-dashboard.component';

@NgModule({
  declarations: [SkyTileDashboardComponent, SkyTileDashboardColumnComponent],
  imports: [CommonModule, DragDropModule, SkyTilesResourcesModule],
  exports: [SkyTileDashboardComponent],
})
export class SkyTileDashboardModule {}
