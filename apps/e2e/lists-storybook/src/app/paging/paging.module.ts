import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyPagingModule } from '@skyux/lists';

import { PagingComponent } from './paging.component';

const routes: Routes = [{ path: '', component: PagingComponent }];
@NgModule({
  declarations: [PagingComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SkyPagingModule],
  exports: [PagingComponent],
})
export class PagingModule {}
