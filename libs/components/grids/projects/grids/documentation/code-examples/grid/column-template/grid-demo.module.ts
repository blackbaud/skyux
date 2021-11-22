import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyGridModule } from 'projects/grids/src/public-api';

import { GridDemoComponent } from './grid-demo.component';

@NgModule({
  imports: [CommonModule, SkyGridModule],
  declarations: [GridDemoComponent],
  exports: [GridDemoComponent],
})
export class GridDemoModule {}
