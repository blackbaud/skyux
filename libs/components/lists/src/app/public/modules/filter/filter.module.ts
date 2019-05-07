import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyIconModule,
  SkyTokensModule
} from '@skyux/indicators';

import {
  SkyListsResourcesModule
} from '../shared';

import {
  SkyFilterButtonComponent
} from './filter-button.component';

import {
  SkyFilterInlineComponent
} from './filter-inline.component';

import {
  SkyFilterInlineItemComponent
} from './filter-inline-item.component';

import {
  SkyFilterSummaryItemComponent
} from './filter-summary-item.component';

import {
  SkyFilterSummaryComponent
} from './filter-summary.component';

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
    SkyIconModule,
    SkyListsResourcesModule,
    SkyTokensModule
  ],
  exports: [
    SkyFilterButtonComponent,
    SkyFilterInlineComponent,
    SkyFilterInlineItemComponent,
    SkyFilterSummaryComponent,
    SkyFilterSummaryItemComponent
  ]
})
export class SkyFilterModule { }
