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
import { SkyPageModule } from '@skyux/pages';

import { map } from 'rxjs';

import { TRANSACTIONS } from './data';

/**
 * Docking the data grid to fill a fit layout page lets the grid render only the
 * rows in view, so it can load a large dataset at once instead of paging
 * through it. This requires the grid to be the predominant element on the page.
 * @title Data grid with data manager in a fit layout page for large datasets
 * @docsDemoHidden
 */
@Component({
  selector: 'app-pages-page-data-manager-data-grid-fit-layout-example',
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDataGrid,
    SkyDataGridColumn,
    SkyDataManagerModule,
    SkyPageModule,
  ],
  providers: [SkyDataManagerService],
})
export class PagesPageDataManagerDataGridFitLayoutExample {
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
    return TRANSACTIONS.filter(({ vendor, category, reference }) =>
      [vendor, category, reference].some((value) =>
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
