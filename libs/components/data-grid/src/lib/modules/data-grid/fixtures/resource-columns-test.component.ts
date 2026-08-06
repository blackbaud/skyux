import { Component, signal } from '@angular/core';
import { provideSkyAgGridTesting } from '@skyux/ag-grid/testing';

import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

interface ResourceRow {
  id: string;
  name: string;
  value: number;
}

@Component({
  selector: 'sky-resource-columns-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  providers: [provideSkyAgGridTesting()],
  template: `
    <sky-data-grid
      data-sky-id="resource-columns-grid"
      [data]="data()"
      [pageSize]="pageSize()"
    >
      <sky-data-grid-column field="name" headingText="Name" />
      @if (showValueColumn()) {
        <sky-data-grid-column field="value" headingText="Value" />
      }
    </sky-data-grid>
  `,
})
export class ResourceColumnsTestComponent {
  public readonly data = signal<ResourceRow[]>([
    { id: '1', name: 'Alice', value: 1 },
    { id: '2', name: 'Bob', value: 2 },
  ]);

  // Signals resembling a `Resource`-shaped object so a test can flip the
  // settled column set and page size exactly as a real resource() would as
  // it resolves - synchronously, in the same tick that creates the grid, so
  // the settled value lands before AG Grid's async `onGridReady` fires.
  public readonly showValueColumn = signal(false);
  public readonly pageSize = signal<number | undefined>(undefined);
}
