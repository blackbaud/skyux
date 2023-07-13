import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkySortModule } from '@skyux/lists';

import { SortComponent } from './sort.component';

const routes: Routes = [{ path: '', component: SortComponent }];
@NgModule({
  declarations: [SortComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkySortModule],
  exports: [SortComponent],
})
export class SortModule {}
