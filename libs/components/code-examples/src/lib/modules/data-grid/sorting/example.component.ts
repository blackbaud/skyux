import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  SkyDataGrid,
  SkyDataGridColumn,
  SkyDataGridSort,
} from '@skyux/data-grid';
import { SkyBoxModule } from '@skyux/layout';

import { DATA_GRID_DEMO_DATA, DataGridSortingRow } from './data';

/**
 * @title Data grid with two-way sort binding
 */
@Component({
  selector: 'app-data-grid-sorting-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyBoxModule, SkyDataGrid, SkyDataGridColumn],
})
export class DataGridSortingExampleComponent {
  protected readonly data: DataGridSortingRow[] = DATA_GRID_DEMO_DATA;

  protected readonly sort = signal<SkyDataGridSort | undefined>({
    field: 'name',
    direction: 'asc',
  });

  protected readonly sortDescription = computed(() => {
    const sort = this.sort();
    if (!sort) {
      return '(no sort applied)';
    }
    return `${sort.field} (${sort.direction === 'desc' ? 'descending' : 'ascending'})`;
  });

  protected sortByAgeDescending(): void {
    this.sort.set({ field: 'age', direction: 'desc' });
  }

  protected clearSort(): void {
    this.sort.set(undefined);
  }
}
