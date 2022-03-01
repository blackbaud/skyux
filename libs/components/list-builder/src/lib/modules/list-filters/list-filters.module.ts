import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFilterModule } from '@skyux/lists';

import { SkyListFilterButtonComponent } from './list-filter-button.component';
import { SkyListFilterInlineItemRendererComponent } from './list-filter-inline-item-renderer.component';
import { SkyListFilterInlineItemComponent } from './list-filter-inline-item.component';
import { SkyListFilterInlineComponent } from './list-filter-inline.component';
import { SkyListFilterSummaryComponent } from './list-filter-summary.component';

@NgModule({
  declarations: [
    SkyListFilterButtonComponent,
    SkyListFilterSummaryComponent,
    SkyListFilterInlineItemComponent,
    SkyListFilterInlineComponent,
    SkyListFilterInlineItemRendererComponent,
  ],
  imports: [CommonModule, SkyFilterModule],
  exports: [
    SkyListFilterButtonComponent,
    SkyListFilterSummaryComponent,
    SkyListFilterInlineItemComponent,
    SkyListFilterInlineComponent,
  ],
})
export class SkyListFiltersModule {}
