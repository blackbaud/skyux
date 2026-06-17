import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SkyDataGridModule } from '@skyux/data-grid';

import { DATA_GRID_DEMO_DATA, DataGridLoadingRow } from './data';

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
  // Demonstration resource. An actual SPA might use [httpResource](https://angular.dev/api/common/http/httpResource)
  // to load remote data.
  protected readonly dataResource = {
    value: signal<DataGridLoadingRow[] | undefined>([...DATA_GRID_DEMO_DATA]),
    isLoading: signal(false),
  };

  protected showData(): void {
    this.dataResource.value.set([...DATA_GRID_DEMO_DATA]);
    this.dataResource.isLoading.set(false);
  }

  protected showEmpty(): void {
    this.dataResource.value.set([]);
    this.dataResource.isLoading.set(false);
  }

  protected showLoading(): void {
    this.dataResource.value.set(undefined);
    this.dataResource.isLoading.set(true);
  }
}
