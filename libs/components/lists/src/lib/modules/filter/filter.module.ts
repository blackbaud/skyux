import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyIconModule, SkyTokensModule } from '@skyux/indicators';

import { SkyThemeModule } from '@skyux/theme';

import { SkyListsResourcesModule } from '../shared/sky-lists-resources.module';

import { SkyFilterButtonComponent } from './filter-button.component';

import { SkyFilterInlineComponent } from './filter-inline.component';

import { SkyFilterInlineItemComponent } from './filter-inline-item.component';

import { SkyFilterSummaryItemComponent } from './filter-summary-item.component';

import { SkyFilterSummaryComponent } from './filter-summary.component';

@NgModule({
  declarations: [
    SkyFilterButtonComponent,
    SkyFilterInlineComponent,
    SkyFilterInlineItemComponent,
    SkyFilterSummaryComponent,
    SkyFilterSummaryItemComponent,
  ],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyListsResourcesModule,
    SkyTokensModule,
    SkyThemeModule,
  ],
  exports: [
    SkyFilterButtonComponent,
    SkyFilterInlineComponent,
    SkyFilterInlineItemComponent,
    SkyFilterSummaryComponent,
    SkyFilterSummaryItemComponent,
  ],
})
export class SkyFilterModule {}
