import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyListModule, SkyListToolbarModule } from '@skyux/list-builder';
import { SkyListViewChecklistModule } from '@skyux/list-builder-view-checklist';
import { SkyModalModule } from '@skyux/modals';

import { SkyColumnSelectorComponent } from './column-selector-modal.component';

@NgModule({
  declarations: [SkyColumnSelectorComponent],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyModalModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule,
  ],
  entryComponents: [SkyColumnSelectorComponent],
})
export class SkyColumnSelectorModule {}
