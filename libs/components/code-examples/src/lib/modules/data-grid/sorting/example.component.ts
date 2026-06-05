import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
} from '@angular/core';
import { SkyDataGridModule, SkyDataGridSort } from '@skyux/data-grid';
import { SkyBoxModule } from '@skyux/layout';

import { DATA_GRID_DEMO_DATA, DataGridSortingRow } from './data';

/**
 * @title Data grid with two-way sort binding
 */
@Component({
  selector: 'app-data-grid-sorting-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyBoxModule, SkyDataGridModule],
})
export class DataGridSortingExampleComponent {
  protected readonly data: DataGridSortingRow[] = DATA_GRID_DEMO_DATA;

  protected readonly sortField = model<
    SkyDataGridSort<DataGridSortingRow> | undefined
  >({
    fieldSelector: 'name',
    descending: false,
  });

  protected readonly sortDescription = computed(() => {
    const sort = this.sortField();
    if (!sort) {
      return 'No sort applied';
    }
    return `${sort.fieldSelector} (${sort.descending ? 'descending' : 'ascending'})`;
  });

  protected sortByAgeDescending(): void {
    this.sortField.set({ fieldSelector: 'age', descending: true });
  }

  protected clearSort(): void {
    this.sortField.set(undefined);
  }
}
