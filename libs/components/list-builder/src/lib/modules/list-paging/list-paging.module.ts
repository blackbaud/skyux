import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyPagingModule } from '@skyux/lists';

import { SkyListPagingComponent } from './list-paging.component';

/**
 * @deprecated List builder and its features are deprecated. Use data manager instead. For more information, see https://developer.blackbaud.com/skyux/components/data-manager.
 */
@NgModule({
  declarations: [SkyListPagingComponent],
  imports: [CommonModule, SkyPagingModule],
  exports: [SkyListPagingComponent],
})
export class SkyListPagingModule {}
