import { Component } from '@angular/core';
import { SkyDataGridSort } from '../../types/data-grid-sort';
import { SkyDataGridColumnComponent } from '../data-grid-column.component';
import { SkyDataGridComponent } from '../data-grid.component';

@Component({
  selector: 'sky-column-id-sort-test',
  imports: [SkyDataGridComponent, SkyDataGridColumnComponent],
  template: `
    <sky-data-grid [data]="data" [sortField]="sortField">
      <sky-data-grid-column columnId="custom" headingText="Custom">
        <ng-template let-row="row">{{ row.column1 }}</ng-template>
      </sky-data-grid-column>
      <sky-data-grid-column field="column1" headingText="Column1" />
    </sky-data-grid>
  `,
})
export class ColumnIdSortTestComponent {
  public data = [
    { id: '1', column1: 'A' },
    { id: '2', column1: 'B' },
  ];

  public sortField:
    | SkyDataGridSort<{ id: string; column1: string }>
    | undefined;
}
