import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SkyDataGridModule } from '@skyux/data-grid';

import { DATA_GRID_DEMO_DATA } from './data';

/**
 * @title Data grid with paging
 */
@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyDataGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example.component.html',
})
export class DataGridPagingComponent {
  protected readonly data = DATA_GRID_DEMO_DATA;

  // When running this example as its own SPA, this parameter is set by calling `provideRouter` with `withComponentInputBinding`.
  public readonly page = input<number, unknown>(1, {
    transform: numberAttribute,
  });

  // For demo purposes, only use the query string if we're running the demo in its own SPA as a route and not on the documentation site.
  protected readonly pageQueryParam =
    inject(ActivatedRoute).component === DataGridPagingComponent ? 'page' : '';
}
