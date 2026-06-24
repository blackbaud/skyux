import { Component } from '@angular/core';
import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

@Component({
  selector: 'sky-flex-width-test',
  imports: [SkyDataGrid, SkyDataGridColumn],
  template: `
    <sky-data-grid [data]="data">
      <sky-data-grid-column
        field="column1"
        flexWidth="0"
        headingText="Column1"
      />
      <sky-data-grid-column field="column2" headingText="Column2" />
    </sky-data-grid>
  `,
})
export class FlexWidthTestComponent {
  public data = [{ id: '1', column1: 'A', column2: 'B' }];
}
