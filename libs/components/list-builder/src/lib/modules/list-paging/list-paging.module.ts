import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyPagingModule } from '@skyux/lists';

import { SkyListPagingComponent } from './list-paging.component';

@NgModule({
  declarations: [SkyListPagingComponent],
  imports: [CommonModule, SkyPagingModule],
  exports: [SkyListPagingComponent],
})
export class SkyListPagingModule {}
