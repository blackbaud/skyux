import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyFluidGridModule } from '@skyux/layout';

import { FluidGridComponent } from './fluid-grid.component';

const routes: Routes = [{ path: '', component: FluidGridComponent }];
@NgModule({
  declarations: [FluidGridComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyFluidGridModule],
  exports: [FluidGridComponent],
})
export class FluidGridModule {}
