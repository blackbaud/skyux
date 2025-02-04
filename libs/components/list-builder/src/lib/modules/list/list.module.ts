import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyListComponent } from './list.component';

/**
 * @deprecated List builder and its features are deprecated. Use data manager instead. For more information, see https://developer.blackbaud.com/skyux/components/data-manager.
 */
@NgModule({
  declarations: [SkyListComponent],
  imports: [CommonModule],
  exports: [SkyListComponent],
})
export class SkyListModule {}
