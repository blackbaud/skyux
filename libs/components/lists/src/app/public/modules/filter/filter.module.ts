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
  SkyListsResourcesModule
} from '../shared';

import {
  SkyFilterButtonComponent
} from './filter-button.component';
import {
  SkyFilterSummaryComponent
} from './filter-summary.component';
import {
  SkyFilterSummaryItemComponent
} from './filter-summary-item.component';
import {
  SkyFilterInlineComponent
} from './filter-inline.component';
import {
  SkyFilterInlineItemComponent
} from './filter-inline-item.component';

import {
  SkyTokensModule
} from '@skyux/indicators/modules/tokens';
import {
  SkyIconModule
} from '@skyux/indicators/modules/icon';

@NgModule({
  declarations: [
    SkyFilterButtonComponent,
    SkyFilterInlineComponent,
    SkyFilterInlineItemComponent,
    SkyFilterSummaryComponent,
    SkyFilterSummaryItemComponent
  ],
  imports: [
    CommonModule,
    SkyI18nModule,
    SkyListsResourcesModule,
    SkyTokensModule,
    SkyIconModule
  ],
  exports: [
    SkyFilterButtonComponent,
    SkyFilterSummaryComponent,
    SkyFilterSummaryItemComponent,
    SkyFilterInlineComponent,
    SkyFilterInlineItemComponent
  ]
})
export class SkyFilterModule { }
