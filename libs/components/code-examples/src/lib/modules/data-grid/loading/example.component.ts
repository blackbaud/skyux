import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  resource,
  signal,
} from '@angular/core';
import {
  SkyDataGrid,
  SkyDataGridColumn,
  SkyDataGridSort,
} from '@skyux/data-grid';

import { DataGridServerPage, getServerPage } from './data';

type DemoBehavior = 'data' | 'empty' | 'loading';

/**
 * @title Data grid with a server-side resource data source
 */
@Component({
  selector: 'app-data-grid-loading-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn],
})
export class DataGridLoadingExampleComponent {
  // Simulate network latency.
  public readonly delay = input(600);

  protected readonly pageSize = 5;
  protected readonly page = signal(1);

  protected readonly sort = signal<SkyDataGridSort | undefined>({
    field: 'name',
    direction: 'asc',
  });

  // The total number of rows available on the server, used to size the paging
  // controls. It is held in its own signal so it persists across page loads.
  protected readonly rowCount = signal(0);

  // Demonstration resource. An actual SPA might use [httpResource](https://angular.dev/api/common/http/httpResource)
  // to load remote data. The server applies the sort and returns one page at a
  // time, so `autoSort` and `autoPage` are disabled on the grid below.
  protected readonly data = resource({
    params: () => ({
      behavior: this.#behavior(),
      delay: this.delay(),
      page: this.page(),
      pageSize: this.pageSize,
      sort: this.sort(),
    }),
    loader: async ({ params, abortSignal }): Promise<DataGridServerPage> => {
      switch (params.behavior) {
        case 'data':
          await new Promise((resolve) => setTimeout(resolve, params.delay));
          return getServerPage(params);
        case 'empty':
          await new Promise((resolve) => setTimeout(resolve, params.delay));
          return { items: [], totalCount: 0 };
        case 'loading':
          return await new Promise((resolve) => {
            abortSignal.addEventListener('abort', () => {
              resolve({ items: [], totalCount: 0 });
            });
          });
        default:
          throw new Error();
      }
    },
  });

  readonly #behavior = signal<DemoBehavior>('data');

  constructor() {
    afterNextRender(() => {
      this.data.reload();
    });

    // Keep the paging controls in sync with the server's most recent total.
    effect(() => {
      const value = this.data.value();
      if (value) {
        this.rowCount.set(value.totalCount);
      }
    });
  }

  protected showData(): void {
    this.page.set(1);
    this.#behavior.set('data');
  }

  protected showEmpty(): void {
    this.#behavior.set('empty');
  }

  protected showLoading(): void {
    this.#behavior.set('loading');
  }
}
