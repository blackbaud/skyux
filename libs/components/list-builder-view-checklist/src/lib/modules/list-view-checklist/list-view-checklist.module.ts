import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';

import { SkyListViewChecklistItemComponent } from './list-view-checklist-item.component';
import { SkyListViewChecklistComponent } from './list-view-checklist.component';

@NgModule({
  declarations: [
    SkyListViewChecklistComponent,
    SkyListViewChecklistItemComponent,
  ],
  imports: [CommonModule, FormsModule, SkyCheckboxModule],
  exports: [SkyListViewChecklistComponent, SkyListViewChecklistItemComponent],
})
export class SkyListViewChecklistModule {}
