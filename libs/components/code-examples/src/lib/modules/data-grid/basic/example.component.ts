import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  signal,
} from '@angular/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';

/**
 * @title Basic data grid
 */
@Component({
  selector: 'app-data-grid-basic-example',
  templateUrl: './example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyBoxModule, SkyDataGrid, SkyDataGridColumn, SkyDropdownModule],
})
export class DataGridBasicExampleComponent {
  protected readonly gridData = signal<DataGridDemoRow[]>(DATA_GRID_DEMO_DATA);
  protected readonly selectedRowIds = model<string[]>([]);

  protected readonly selectedNames = computed(() => {
    const selectedRowIds = this.selectedRowIds();
    return this.gridData()
      .filter((row) => selectedRowIds.includes(row.id))
      .map((row: DataGridDemoRow) => row.name)
      .sort((a, b) => a.localeCompare(b))
      .join(', ');
  });

  public actionClicked(row: DataGridDemoRow, action: string): void {
    alert(`${action} clicked for ${row.name}`);
  }
}
