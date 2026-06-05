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
  // `null` shows the loading indicator, `[]` shows the "no rows" message, and a
  // populated array shows the data.
  protected readonly data = signal<DataGridLoadingRow[] | null>(
    DATA_GRID_DEMO_DATA,
  );

  protected showData(): void {
    this.data.set(DATA_GRID_DEMO_DATA);
  }

  protected showEmpty(): void {
    this.data.set([]);
  }

  protected showLoading(): void {
    this.data.set(null);
  }
}
