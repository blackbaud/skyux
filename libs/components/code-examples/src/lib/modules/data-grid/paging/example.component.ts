import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';

import { DATA_GRID_DEMO_DATA } from './data';

/**
 * @title Data grid with paging using router query parameters
 */
@Component({
  selector: 'app-data-grid-paging-example',
  imports: [SkyDataGrid, SkyDataGridColumn],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example.component.html',
})
export class DataGridPagingExampleComponent {
  protected readonly data = DATA_GRID_DEMO_DATA;

  // For demo purposes, only use the query string if we're running the demo in its own SPA as a route and not on the documentation site.
  protected readonly pageQueryParam =
    inject(ActivatedRoute, { optional: true })?.component ===
    DataGridPagingExampleComponent
      ? 'page'
      : '';
}
