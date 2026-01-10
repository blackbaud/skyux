import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';

import { ContextMenuComponent } from './context-menu.component';
import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';

/**
 * @title Basic data grid example without data manager
 */
@Component({
  selector: 'app-ag-grid-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContextMenuComponent,
    SkyDataGridComponent,
    SkyDataGridColumnComponent,
  ],
})
export class DataGridBasicExampleComponent {
  protected gridData: DataGridDemoRow[] = DATA_GRID_DEMO_DATA;
}
