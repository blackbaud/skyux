import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SkyDataGridModule } from '@skyux/data-grid';
import { SkyDropdownModule } from '@skyux/popovers';

import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';

/**
 * @title Basic data grid
 */
@Component({
  selector: 'app-data-grid-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGridModule, SkyDropdownModule],
})
export class DataGridBasicExampleComponent {
  protected gridData: DataGridDemoRow[] = DATA_GRID_DEMO_DATA;

  public actionClicked(row: DataGridDemoRow, action: string): void {
    alert(`${action} clicked for ${row.name}`);
  }
}
