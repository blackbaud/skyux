import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
} from '@skyux/data-manager';

import { DATA_GRID_DEMO_DATA } from './data';

/**
 * @title Data grid with a data manager column picker
 */
@Component({
  selector: 'app-data-grid-data-manager-example',
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDataManagerModule],
  providers: [SkyDataManagerService],
})
export class DataGridDataManagerExample {
  protected readonly data = DATA_GRID_DEMO_DATA;
  protected readonly viewId = 'gridView';

  constructor() {
    const dataManagerSvc = inject(SkyDataManagerService);

    dataManagerSvc.initDataManager({
      activeViewId: this.viewId,
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({}),
    });

    dataManagerSvc.initDataView({
      id: this.viewId,
      name: 'Grid View',
      columnPickerEnabled: true,
    });
  }
}
