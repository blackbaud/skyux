import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { DATA_GRID_DEMO_DATA, DataGridDataManagerRow } from './data';

/**
 * @title Data grid in a data manager with a column picker
 */
@Component({
  selector: 'app-data-grid-data-manager-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDataManagerModule],
  providers: [SkyDataManagerService],
})
export class DataGridDataManagerExampleComponent {
  protected readonly data = computed<DataGridDataManagerRow[]>(() => {
    const data = DATA_GRID_DEMO_DATA.slice();
    const searchValue = this.#search().trim().normalize('NFD').toLowerCase();
    if (searchValue) {
      return data.filter(({ name, type, color }) =>
        [name, type, color].some((value) =>
          value.trim().normalize('NFD').toLowerCase().includes(searchValue),
        ),
      );
    }
    return data;
  });
  protected readonly viewId = 'gridView' as const;

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #search = toSignal(
    this.#dataManagerSvc
      .getDataStateUpdates('search', { properties: ['searchText'] })
      .pipe(map((state) => state.searchText ?? '')),
    { initialValue: '' },
  );

  constructor() {
    this.#dataManagerSvc.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: { listDescriptor: 'fruit' },
      defaultDataState: new SkyDataManagerState({
        views: [{ viewId: this.viewId }],
      }),
    });
    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Grid View',
      iconName: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
    });
  }
}
