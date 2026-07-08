import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { SkyDataGrid, SkyDataGridColumn } from '@skyux/data-grid';
import { SkyDropdownModule } from '@skyux/popovers';

import { DATA_GRID_DEMO_DATA, DataGridDemoRow } from './data';

/**
 * @title Basic data grid
 */
@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyDataGrid, SkyDataGridColumn, SkyDropdownModule],
})
export class DataGridComponent {
  public readonly sizingVariant = input<'fixed' | 'flex' | 'auto'>('fixed');
  public readonly columnFit = input<'content' | 'container'>('content');

  protected readonly fixedSizes = computed<
    Record<
      'name' | 'age' | 'startDate' | 'endDate' | 'department' | 'jobTitle',
      number | undefined
    >
  >(() => ({
    name:
      this.sizingVariant() === 'fixed'
        ? 240
        : this.sizingVariant() === 'flex'
          ? 200
          : undefined,
    age: this.sizingVariant() === 'fixed' ? 60 : undefined,
    startDate: this.sizingVariant() === 'fixed' ? 120 : undefined,
    endDate: this.sizingVariant() === 'fixed' ? 120 : undefined,
    department:
      this.sizingVariant() === 'fixed'
        ? 300
        : this.sizingVariant() === 'flex'
          ? 200
          : undefined,
    jobTitle:
      this.sizingVariant() === 'fixed'
        ? 300
        : this.sizingVariant() === 'flex'
          ? 200
          : undefined,
  }));
  protected readonly flexSizes = computed<
    Record<
      'name' | 'age' | 'startDate' | 'endDate' | 'department' | 'jobTitle',
      number | undefined
    >
  >(() => ({
    name: this.sizingVariant() === 'flex' ? 24 : undefined,
    age: this.sizingVariant() === 'flex' ? 5 : undefined,
    startDate: this.sizingVariant() === 'flex' ? 7 : undefined,
    endDate: this.sizingVariant() === 'flex' ? 7 : undefined,
    department: this.sizingVariant() === 'flex' ? 30 : undefined,
    jobTitle: this.sizingVariant() === 'flex' ? 30 : undefined,
  }));
  protected readonly gridData: DataGridDemoRow[] = DATA_GRID_DEMO_DATA;

  public actionClicked(row: DataGridDemoRow, action: string): void {
    alert(`${action} clicked for ${row.name}`);
  }
}
export default DataGridComponent;
