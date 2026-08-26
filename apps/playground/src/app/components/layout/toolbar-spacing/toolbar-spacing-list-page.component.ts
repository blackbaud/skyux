import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyListSummaryModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyPageModule } from '@skyux/pages';

import { FilterItemModalComponent } from './filter-item-modal.component';

/**
 * The case that already works and must keep working. Inside a
 * `layout="list"` page there is no parent padding for the toolbar, filter bar,
 * or list summary to inherit, so each one supplies its own inset and the whole
 * stack lines up on a single left edge.
 */
@Component({
  imports: [
    SkyFilterBarModule,
    SkyListSummaryModule,
    SkyPageModule,
    SkySearchModule,
    SkyToolbarModule,
  ],
  templateUrl: './toolbar-spacing-list-page.component.html',
  styleUrl: './toolbar-spacing-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ToolbarSpacingListPageComponent {
  protected readonly modalComponent = FilterItemModalComponent;

  protected readonly rows = [
    { name: 'Abigail Bennett', status: 'Active', total: '$1,204' },
    { name: 'Marcus Ellery', status: 'Active', total: '$842' },
    { name: 'Priya Raghunathan', status: 'Lapsed', total: '$3,915' },
    { name: 'Tomas Okonkwo', status: 'Active', total: '$517' },
  ];

  protected selectedFilterIds: string[] | undefined;
}
