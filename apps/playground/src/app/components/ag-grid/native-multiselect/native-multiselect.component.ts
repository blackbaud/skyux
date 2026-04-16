import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyAgGridModule, SkyAgGridService, SkyCellType } from '@skyux/ag-grid';

import { AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridOptions,
  ModuleRegistry,
  RowSelectionOptions,
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface DemoRow {
  name: string;
  age: number;
  department: string;
}

const DEMO_DATA: DemoRow[] = [
  { name: 'Billy Bob', age: 55, department: 'Customer Support' },
  { name: 'Jane Deere', age: 33, department: 'Engineering' },
  { name: 'John Doe', age: 38, department: 'Sales' },
  { name: 'Sarah Smith', age: 28, department: 'Marketing' },
  { name: 'Tom Jones', age: 45, department: 'Engineering' },
];

/**
 * Playground for ADO #3944470 — native ag-grid headerCheckbox indeterminate state.
 *
 * Steps to reproduce the bug:
 * 1. Check one or two (but not all) row checkboxes.
 * 2. The header checkbox should appear shaded/indeterminate but shows empty instead.
 */
@Component({
  selector: 'app-native-multiselect',
  templateUrl: './native-multiselect.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AgGridModule, SkyAgGridModule],
})
export class NativeMultiselectComponent {
  protected readonly gridOptions: GridOptions;

  readonly #agGridSvc = inject(SkyAgGridService);

  constructor() {
    const rowSelection: RowSelectionOptions = {
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
      selectAll: 'filtered',
    };

    this.gridOptions = this.#agGridSvc.getGridOptions({
      gridOptions: {
        rowData: DEMO_DATA,
        rowSelection,
        columnDefs: [
          { field: 'name', headerName: 'Name' },
          {
            field: 'age',
            headerName: 'Age',
            type: SkyCellType.Number,
            maxWidth: 80,
          },
          { field: 'department', headerName: 'Department' },
        ],
      },
    });
  }
}
