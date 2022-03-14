import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyPagingModule } from '@skyux/lists';

import { PagingDemoComponent } from './paging-demo.component';

@NgModule({
  imports: [CommonModule, SkyPagingModule],
  declarations: [PagingDemoComponent],
  exports: [PagingDemoComponent],
})
export class PagingDemoModule {}
