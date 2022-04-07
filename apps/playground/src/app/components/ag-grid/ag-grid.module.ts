import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { AgGridRoutingModule } from './ag-grid-routing.module';
import { AgGridComponent } from './ag-grid.component';

@NgModule({
  declarations: [AgGridComponent],
  imports: [AgGridRoutingModule, CommonModule, RouterModule, SkyThemeModule],
  providers: [SkyThemeService],
})
export class AgGridModule {}
