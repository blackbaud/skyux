import { Component } from '@angular/core';
import {
  SkyDataGridColumnComponent,
  SkyDataGridComponent,
} from '@skyux/data-grid';

@Component({
  selector: 'sky-flex-width-test',
  imports: [SkyDataGridComponent, SkyDataGridColumnComponent],
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
