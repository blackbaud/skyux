import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';

import { AG_GRID_DEMO_DATA } from '../../../shared/data-manager/data-manager-data';

@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyDataGridComponent, SkyDataGridColumnComponent],
  templateUrl: './grid-paging.component.html',
})
export default class GridPagingComponent {
  readonly #router = inject(Router);

  // Read page from route input binding, if available.
  public readonly page = input<string>();

  protected readonly data = AG_GRID_DEMO_DATA;

  /**
   * Simulates the paging query param set on initialization.
   */
  protected setQueryParamAndReload(): void {
    void this.#router.navigate([], {
      queryParams: { page: 2 },
      queryParamsHandling: 'merge',
    });
  }
}
