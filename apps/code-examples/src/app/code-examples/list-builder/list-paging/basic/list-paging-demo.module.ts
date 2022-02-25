import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  SkyListModule,
  SkyListPagingModule,
} from 'projects/list-builder/src/public-api';

import { ListPagingDemoComponent } from './list-paging-demo.component';

@NgModule({
  imports: [CommonModule, SkyListModule, SkyListPagingModule],
  declarations: [ListPagingDemoComponent],
  exports: [ListPagingDemoComponent],
})
export class ListPagingDemoModule {}
