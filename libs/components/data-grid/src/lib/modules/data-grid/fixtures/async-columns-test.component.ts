import { Component, signal } from '@angular/core';

import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

interface AsyncColumnsRow {
  id: string;
  name: string;
  age: string;
}

interface AsyncColumnDef {
  field: string;
  headingText: string;
}

/**
 * Mirrors a consumer scenario where columns are not known synchronously (for
 * example, resolved from a resource or an async column-picker selection) and
 * are rendered with `@for`. Regression fixture for NG0950 (see
 * angular/angular#59067): Angular populates signal content queries before it
 * applies the queried `sky-data-grid-column` instances' input bindings, so
 * columns created after the grid's first render must not be read from the
 * content query until their bindings have been applied.
 */
@Component({
  selector: 'sky-async-columns-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  template: `
    <sky-data-grid data-sky-id="async-columns-grid" [data]="data()">
      @for (col of columns(); track col.field) {
        <sky-data-grid-column
          [field]="col.field"
          [headingText]="col.headingText"
        />
      }
    </sky-data-grid>
  `,
})
export class AsyncColumnsTestComponent {
  public readonly data = signal<AsyncColumnsRow[]>([
    { id: '1', name: 'Billy Bob', age: '55' },
    { id: '2', name: 'Jane Deere', age: '33' },
  ]);

  // Starts empty to simulate columns that are not yet available on the first
  // render, then populated asynchronously (or synchronously in a later test
  // step) to exercise the `@for` loop creating columns after the grid exists.
  public readonly columns = signal<AsyncColumnDef[]>([]);
}
