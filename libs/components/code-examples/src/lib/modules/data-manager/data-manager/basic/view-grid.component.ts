import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';

import { DataManagerDemoRow } from './data';
import { filterItems } from './filters';

@Component({
  selector: 'app-view-grid',
  templateUrl: './view-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDataManagerModule],
})
export class ViewGridComponent {
  public readonly items = input<DataManagerDemoRow[]>([]);

  protected readonly viewId = 'gridView';

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataState = toSignal(
    this.#dataManagerSvc.getDataStateUpdates(`${this.viewId}-data-state`),
    { initialValue: new SkyDataManagerState({}) },
  );
  protected readonly displayedItems = computed(() => {
    const dataState = this.#dataState();
    return filterItems(
      this.items(),
      dataState.filterData?.filters as SkyFilterBarFilterState | undefined,
      dataState.searchText,
    );
  });

  constructor() {
    effect(() => {
      this.#dataManagerSvc.updateDataSummary(
        {
          totalItems: this.items().length,
          itemsMatching: this.displayedItems().length,
        },
        this.viewId,
      );
    });
    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Grid View',
      iconName: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
      sortEnabled: true,
    });
  }
}
