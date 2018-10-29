import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyListToolbarModule,
  SkyListSecondaryActionsModule
} from '@skyux/list-builder';

import {
  SkyListColumnSelectorActionComponent
} from './list-column-selector-action.component';

import {
  SkyModalModule
} from '@skyux/modals';

@NgModule({
  declarations: [
    SkyListColumnSelectorActionComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyModalModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyIconModule
  ],
  exports: [
    SkyListColumnSelectorActionComponent
  ]
})
export class SkyListColumnSelectorActionModule {
}
