import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyPercentPipe } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';
import { SkyPageModule } from '@skyux/pages';
import { map } from 'rxjs/operators';
import {
  columnDefinitions,
  data,
} from '../../../shared/data-manager/baseball-players-data';
import { DockedMenuComponent } from '../docked-menu';

@Component({
  selector: 'app-docked-with-data-manager',
  imports: [
    SkyDataGridColumn,
    SkyDataGrid,
    SkyPageModule,
    SkyPercentPipe,
    SkyDataManagerModule,
    DockedMenuComponent,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './docked-with-data-manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DockedWithDataManagerComponent {
  protected readonly columns = columnDefinitions;
  protected readonly data = computed(() => {
    const searchText = this.#search().toLowerCase();
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchText),
      ),
    );
  });

  readonly #dm = inject(SkyDataManagerService);
  readonly #search = toSignal(
    this.#dm
      .getDataStateUpdates('search', { properties: ['searchText'] })
      .pipe(map((state) => state.searchText ?? '')),
    { initialValue: '' },
  );

  constructor() {
    this.#dm.initDataManager({
      activeViewId: 'grid-view',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({}),
    });
    this.#dm.initDataView({
      id: 'grid-view',
      name: 'Grid View',
      iconName: 'table',
      searchEnabled: true,
      columnPickerEnabled: true,
    });
  }
}
export default DockedWithDataManagerComponent;
