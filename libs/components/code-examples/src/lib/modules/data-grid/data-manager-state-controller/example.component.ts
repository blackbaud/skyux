import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  SkyDataGridModule,
  SkyDataHost,
} from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';

/**
 * @title Data grid with data manager state controller
 */
@Component({
  selector: 'app-data-grid-data-manager-state-controller-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService],
  imports: [SkyDataGridModule, SkyDataManagerModule],
})
export class DataGridDataManagerStateControllerExampleComponent {
  protected readonly gridData = signal<DataGridDemoRow[]>(DATA_GRID_DEMO_DATA);
  protected readonly gridState = signal<SkyDataHost | undefined>(undefined);
  protected readonly viewId = 'dataGridWithStateControllerView' as const;

  readonly #dataManagerSvc = inject(SkyDataManagerService);

  constructor() {
    this.#dataManagerSvc.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({
        views: [
          {
            viewId: this.viewId,
            displayedColumnIds: ['name', 'age', 'startDate', 'department'],
          },
        ],
      }),
    });
    this.#dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Data Grid View',
      iconName: 'table',
      searchEnabled: false,
      columnPickerEnabled: true,
    });
  }
}
