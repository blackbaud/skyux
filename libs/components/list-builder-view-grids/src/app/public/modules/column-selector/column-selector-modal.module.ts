import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyColumnSelectorComponent
} from './column-selector-modal.component';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyModalModule
} from '@skyux/modals';
import {
  SkyListModule
} from '@skyux/list-builder';

import {
  SkyListToolbarModule
} from '@skyux/list-builder';

import {
  SkyListViewChecklistModule
} from '@skyux/list-builder-view-checklist';

@NgModule({
  declarations: [
    SkyColumnSelectorComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyModalModule,
    SkyListModule,
    SkyListToolbarModule,
    SkyListViewChecklistModule
  ],
  exports: [
    SkyColumnSelectorComponent
  ],
  entryComponents: [
    SkyColumnSelectorComponent
  ]
})
export class SkyColumnSelectorModule {
}
