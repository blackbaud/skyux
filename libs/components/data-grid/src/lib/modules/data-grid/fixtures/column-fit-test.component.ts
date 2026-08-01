import { Component } from '@angular/core';
import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

/**
 * Deliberately omits `provideSkyAgGridTesting()` so the grids in this fixture
 * use the real `SkyAgGridService`, and so tests using it observe the real
 * `autoSizeStrategy` grid option rather than the testing override that
 * suppresses it.
 */
@Component({
  selector: 'sky-column-fit-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  template: `
    <sky-data-grid data-sky-id="container-fit-grid" [data]="data">
      <sky-data-grid-column field="column1" headingText="Column1" />
      <sky-data-grid-column field="column2" headingText="Column2" />
    </sky-data-grid>
    <sky-data-grid
      data-sky-id="content-fit-grid"
      columnFit="content"
      [data]="data"
    >
      <sky-data-grid-column field="column1" headingText="Column1" />
      <sky-data-grid-column field="column2" headingText="Column2" />
    </sky-data-grid>
  `,
})
export class ColumnFitTestComponent {
  public data = [
    { id: '1', column1: 'A', column2: 'B' },
    { id: '2', column1: 'C', column2: 'D' },
  ];
}
