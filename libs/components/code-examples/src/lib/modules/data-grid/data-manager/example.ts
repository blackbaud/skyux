import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { map } from 'rxjs';

import { DATA_GRID_DEMO_DATA } from './data';

/**
 * @title Data grid with a data manager column picker and search
 */
@Component({
  selector: 'app-data-grid-data-manager-example',
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDataManagerModule],
  providers: [SkyDataManagerService],
})
export class DataGridDataManagerExample {
  protected readonly viewId = 'gridView';

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #searchText = toSignal(
    this.#dataManagerSvc
      .getDataStateUpdates(this.viewId)
      .pipe(map((state) => state.searchText ?? '')),
    { initialValue: '' },
  );

  protected readonly data = computed(() => {
    const searchText = this.#searchText().toLowerCase();
    return DATA_GRID_DEMO_DATA.filter(({ name, type, color }) =>
      [name, type, color].some((value) =>
        value.toLowerCase().includes(searchText),
      ),
    );
  });

  constructor() {
    this.#dataManagerSvc.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({}),
    });

    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Grid View',
      columnPickerEnabled: true,
      searchEnabled: true,
    });
  }
}
