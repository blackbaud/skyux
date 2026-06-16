import {
  ChangeDetectionStrategy,
  Component,
  input,
  resource,
  signal,
} from '@angular/core';
import { SkyDataGridModule, SkyDataGridSort } from '@skyux/data-grid';

import { DATA_GRID_DEMO_DATA, DataGridLoadingRow } from './data';

type DemoBehavior = 'data' | 'empty' | 'loading';

/**
 * @title Data grid loading and empty states
 */
@Component({
  selector: 'app-data-grid-loading-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGridModule],
})
export class DataGridLoadingExampleComponent {
  public readonly delay = input(600);

  readonly #behavior = signal<DemoBehavior>('data');

  // Demonstration resource. An actual SPA might use [httpResource](https://angular.dev/api/common/http/httpResource)
  // to load remote data.
  protected readonly data = resource({
    params: () => ({
      behavior: this.#behavior(),
      sortField: this.sortField(),
      delay: this.delay(),
    }),
    loader: async ({ params }): Promise<DataGridLoadingRow[]> => {
      if (params.behavior === 'loading') {
        return new Promise(() => undefined);
      }

      // Simulate a delay to show the loading state before the data appears.
      await new Promise((resolve) => setTimeout(resolve, params.delay));

      if (params.behavior === 'empty') {
        return [];
      }
      const data = [...DATA_GRID_DEMO_DATA] as DataGridLoadingRow[];
      if (params.sortField) {
        if (params.sortField.fieldSelector === 'name') {
          data.sort((a, b) => a.name.localeCompare(b.name));
        } else if (params.sortField.fieldSelector === 'age') {
          data.sort((a, b) => a.age - b.age);
        } else if (params.sortField.fieldSelector === 'startDate') {
          data.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        }
        if (params.sortField.descending) {
          data.reverse();
        }
      }
      return data;
    },
    defaultValue: [],
  });
  protected sortField = signal<SkyDataGridSort<DataGridLoadingRow>>({
    fieldSelector: 'name',
    descending: false,
  });

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
