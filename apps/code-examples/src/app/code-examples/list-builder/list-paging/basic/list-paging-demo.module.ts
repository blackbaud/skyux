import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyListModule, SkyListPagingModule } from '@skyux/list-builder';

import { ListPagingDemoComponent } from './list-paging-demo.component';

@NgModule({
  imports: [CommonModule, SkyListModule, SkyListPagingModule],
  declarations: [ListPagingDemoComponent],
  exports: [ListPagingDemoComponent],
})
export class ListPagingDemoModule {}
