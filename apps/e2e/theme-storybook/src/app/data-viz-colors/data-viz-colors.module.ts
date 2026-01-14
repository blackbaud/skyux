import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataVizColorsComponent } from './data-viz-colors.component';

const routes: Routes = [{ path: '', component: DataVizColorsComponent }];
@NgModule({
  declarations: [DataVizColorsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DataVizColorsComponent],
})
export class DataVizColorsModule {}
