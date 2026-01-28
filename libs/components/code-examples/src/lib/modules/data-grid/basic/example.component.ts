import {
  ChangeDetectionStrategy,
  Component,
  computed,
  model,
  signal,
} from '@angular/core';
import {
  SkyAgGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs,
} from '@skyux/ag-grid';
import { SkyDataGridModule } from '@skyux/data-grid';
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
  imports: [SkyBoxModule, SkyDataGridModule, SkyDropdownModule],
})
export class DataGridBasicExampleComponent {
  protected readonly gridData = signal<DataGridDemoRow[]>(DATA_GRID_DEMO_DATA);
  protected readonly rowDeleteIds = model<string[]>([]);
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
    if (action === 'Delete') {
      this.rowDeleteIds.update((rowDeleteIds) => [
        ...new Set([...rowDeleteIds, row.id]),
      ]);
    } else {
      alert(`${action} clicked for ${row.name}`);
    }
  }

  protected rowDeleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.gridData.update((gridData) =>
      gridData.filter(({ id }) => id !== $event.id),
    );
    this.rowDeleteIds.update((rowDeleteIds) =>
      rowDeleteIds.filter((id) => id !== $event.id),
    );
  }

  protected rowDeleteCancel($event: SkyAgGridRowDeleteCancelArgs): void {
    this.rowDeleteIds.update((rowDeleteIds) =>
      rowDeleteIds.filter((id) => id !== $event.id),
    );
  }
}
