import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
} from '@skyux/data-manager';

import { DATA_GRID_DEMO_DATA, DataGridDataManagerRow } from './data';

/**
 * @title Data grid in a data manager with a column picker
 */
@Component({
  selector: 'app-data-grid-data-manager-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SkyDataManagerService, SkyUIConfigService],
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDataManagerModule],
})
export class DataGridDataManagerExampleComponent {
  protected readonly data: DataGridDataManagerRow[] = DATA_GRID_DEMO_DATA;
}
