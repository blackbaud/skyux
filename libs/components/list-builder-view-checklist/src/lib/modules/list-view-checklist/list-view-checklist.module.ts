import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { SkyListViewChecklistItemComponent } from './list-view-checklist-item.component';
import { SkyListViewChecklistComponent } from './list-view-checklist.component';

/**
 * @deprecated List builder and its features are deprecated. Use repeater instead. For more information, see https://developer.blackbaud.com/skyux/components/repeater.
 */
@NgModule({
  declarations: [
    SkyListViewChecklistComponent,
    SkyListViewChecklistItemComponent,
  ],
  imports: [CommonModule, FormsModule, SkyCheckboxModule],
  exports: [SkyListViewChecklistComponent, SkyListViewChecklistItemComponent],
})
export class SkyListViewChecklistModule {}
