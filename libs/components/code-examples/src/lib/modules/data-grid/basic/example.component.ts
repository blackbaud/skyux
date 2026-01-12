import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';
import { SkyDropdownModule } from '@skyux/popovers';

import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';

/**
 * @title Basic data grid
 */
@Component({
  selector: 'app-ag-grid-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SkyDataGridComponent,
    SkyDataGridColumnComponent,
    SkyDropdownModule,
  ],
})
export class DataGridBasicExampleComponent {
  protected gridData: DataGridDemoRow[] = DATA_GRID_DEMO_DATA;

  public actionClicked(row: DataGridDemoRow, action: string): void {
    alert(`${action} clicked for ${row.name}`);
  }
}
