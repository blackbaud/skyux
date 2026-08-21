import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';

import { DATA_GRID_DEMO_DATA, DataGridDataManagerRow } from './data';

/**
 * @title Data grid in a data manager with a column picker
 */
@Component({
  selector: 'app-data-grid-data-manager-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDataManagerModule],
})
export class DataGridDataManagerExampleComponent {
  protected readonly data = computed<DataGridDataManagerRow[]>(() => {
    const data = DATA_GRID_DEMO_DATA.slice();
    const searchValue = this.search().trim().normalize('NFD').toLowerCase();
    if (searchValue) {
      return data.filter(({ name, type, color }) =>
        [name, type, color].some((value) =>
          value.trim().normalize('NFD').toLowerCase().includes(searchValue),
        ),
      );
    }
    return data;
  });
  protected readonly search = signal('');
}
