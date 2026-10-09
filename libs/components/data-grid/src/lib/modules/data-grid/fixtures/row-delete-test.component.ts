import { Component, signal } from '@angular/core';
import { provideSkyAgGridTesting } from '@skyux/ag-grid/testing';

import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

@Component({
  selector: 'sky-row-delete-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  providers: [provideSkyAgGridTesting()],
  template: `
    <sky-data-grid [data]="data()" [(rowDeleteIds)]="rowDeleteIds">
      <sky-data-grid-column field="name" headingText="Name" />
    </sky-data-grid>
  `,
})
export class RowDeleteTestComponent {
  public readonly data = signal([
    { id: '1', name: 'Apple' },
    { id: '2', name: 'Banana' },
    { id: '3', name: 'Cherry' },
  ]);

  public readonly rowDeleteIds = signal<string[]>([]);
}
