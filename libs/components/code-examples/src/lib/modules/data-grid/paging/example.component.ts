import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDataGridModule } from '@skyux/data-grid';

import { DATA_GRID_DEMO_DATA } from './data';

/**
 * @title Data grid with paging
 */
@Component({
  selector: 'app-data-grid-paging',
  imports: [SkyDataGridModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example.component.html',
})
export class DataGridPagingComponent {
  protected readonly data = DATA_GRID_DEMO_DATA;
}
