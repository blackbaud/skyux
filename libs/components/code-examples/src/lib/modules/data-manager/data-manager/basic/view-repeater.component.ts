import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyFilterBarFilterState } from '@skyux/filter-bar';
import { SkyRepeaterModule } from '@skyux/lists';

import { DataManagerDemoRow } from './data';
import { filterItems } from './filters';

@Component({
  selector: 'app-view-repeater',
  templateUrl: './view-repeater.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataManagerModule, SkyRepeaterModule],
})
export class ViewRepeaterComponent {
  public readonly items = input<DataManagerDemoRow[]>([]);

  protected readonly viewId = 'repeaterView';

  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataState = toSignal(
    this.#dataManagerSvc.getDataStateUpdates(this.viewId),
    { initialValue: new SkyDataManagerState({}) },
  );

  protected readonly selectedItems = linkedSignal(
    () => this.#dataState().selectedIds ?? [],
  );
  protected readonly displayedItems = computed(() => {
    const dataState = this.#dataState();
    const selectedItems = this.selectedItems();
    const items = filterItems(
      this.items(),
      dataState.filterData?.filters as SkyFilterBarFilterState | undefined,
      dataState.searchText,
    );
    const sortOption = dataState.activeSortOption;
    if (sortOption?.propertyName) {
      const field = sortOption.propertyName as keyof DataManagerDemoRow;
      const descending = sortOption.descending ?? false;

      items.sort((a: DataManagerDemoRow, b: DataManagerDemoRow) => {
        const aValue = String(a[field]);
        const bValue = String(b[field]);
        if (descending) {
          return bValue.localeCompare(aValue);
        }
        return aValue.localeCompare(bValue);
      });
    }
    if (dataState.onlyShowSelected) {
      return items.filter((item) => selectedItems.includes(item.id));
    }
    return items;
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
    effect(() => {
      const selectedItems = this.selectedItems();
      const dataState = untracked(this.#dataState);
      const currentSelectedIds = dataState.selectedIds ?? [];
      if (
        selectedItems.length !== currentSelectedIds.length ||
        !selectedItems.every((id) => currentSelectedIds.includes(id))
      ) {
        dataState.selectedIds = selectedItems;
        this.#dataManagerSvc.updateDataState(dataState, this.viewId);
      }
    });
    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Repeater View',
      iconName: 'text-bullet-list',
      searchEnabled: true,
      sortEnabled: true,
      multiselectToolbarEnabled: true,
      onClearAllClick: () => {
        this.selectedItems.set([]);
      },
      onSelectAllClick: () => {
        this.selectedItems.set(this.items().map((item) => item.id));
      },
    });
  }

  protected onItemSelect(isSelected: boolean, item: DataManagerDemoRow): void {
    if (!isSelected) {
      this.selectedItems.update((ids) => ids.filter((id) => id !== item.id));
    } else {
      this.selectedItems.update((ids) => {
        if (!ids.includes(item.id)) {
          return ids.concat([item.id]);
        }
        return ids;
      });
    }
    item.selected = isSelected;
  }
}
