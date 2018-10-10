import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyCheckboxModule
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyListViewChecklistComponent
} from './list-view-checklist.component';

import {
  SkyListViewChecklistItemComponent
} from './list-view-checklist-item.component';

@NgModule({
  declarations: [
    SkyListViewChecklistComponent,
    SkyListViewChecklistItemComponent
  ],
  exports: [
    SkyListViewChecklistComponent,
    SkyListViewChecklistItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyI18nModule
  ]
})
export class SkyListViewChecklistModule {
}
