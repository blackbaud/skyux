import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
  signal,
} from '@angular/core';
import { SkyDataGridModule, SkyDataGridSort } from '@skyux/data-grid';

import { DataGridLoadingRow, getDataSorted } from './data';

type DemoBehavior = 'data' | 'empty' | 'loading';

/**
 * @title Data grid loading, empty states, and resource data source
 */
@Component({
  selector: 'app-data-grid-loading-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGridModule],
})
export class DataGridLoadingExampleComponent {
  // Simulate network latency.
  public readonly delay = input(600);

  protected readonly sortField = signal<
    SkyDataGridSort<DataGridLoadingRow> | undefined
  >({
    fieldSelector: 'name',
    descending: false,
  });

  // Demonstration resource. An actual SPA might use [httpResource](https://angular.dev/api/common/http/httpResource)
  // to load remote data.
  protected readonly data = resource({
    params: () => ({
      behavior: this.#behavior(),
      delay: this.delay(),
      sortField: this.sortField(),
    }),
    loader: async ({ params, abortSignal }): Promise<DataGridLoadingRow[]> => {
      switch (params.behavior) {
        case 'data':
          await new Promise((resolve) => setTimeout(resolve, params.delay));
          return getDataSorted(params.sortField);
        case 'empty':
          await new Promise((resolve) => setTimeout(resolve, params.delay));
          return [];
        case 'loading':
          return await new Promise((resolve) => {
            abortSignal.addEventListener('abort', () => {
              resolve([]);
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
  }

  protected showData(): void {
    this.#behavior.set('data');
  }

  protected showEmpty(): void {
    this.#behavior.set('empty');
  }

  protected showLoading(): void {
    this.#behavior.set('loading');
  }
}
