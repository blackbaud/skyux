import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyI18nModule } from '@skyux/i18n';
import { SkyIconModule } from '@skyux/indicators';
import {
  SkyListSecondaryActionsModule,
  SkyListToolbarModule,
} from '@skyux/list-builder';
import { SkyModalModule } from '@skyux/modals';

import { SkyColumnSelectorModule } from '../column-selector/column-selector-modal.module';

import { SkyListColumnSelectorActionComponent } from './list-column-selector-action.component';
import { SkyListColumnSelectorButtonComponent } from './list-column-selector-button.component';

/**
 * @deprecated List builder view grid and its features are deprecated. Use data entry grid instead. For more information, see https://developer.blackbaud.com/skyux/components/data-entry-grid.
 */
@NgModule({
  declarations: [
    SkyListColumnSelectorActionComponent,
    SkyListColumnSelectorButtonComponent,
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyModalModule,
    SkyListSecondaryActionsModule,
    SkyListToolbarModule,
    SkyIconModule,
  ],
  exports: [SkyListColumnSelectorActionComponent, SkyColumnSelectorModule],
})
export class SkyListColumnSelectorActionModule {}
