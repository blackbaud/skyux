import { Component, input, model } from '@angular/core';

import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

@Component({
  selector: 'app-column-selection-test',
  template: `<sky-data-grid
    [data]="data()"
    [(selectedColumnIds)]="selectedColumnIds"
  >
    <sky-data-grid-column
      columnId="locked"
      headingText="Locked"
      locked
      [description]="lockedDescription()"
    />
    <sky-data-grid-column field="name" headingText="Name" />
    <sky-data-grid-column field="age" headingText="Age" dataType="number" />
    @if (showExtra()) {
      <sky-data-grid-column
        field="extra"
        headingText="Extra"
        [columnHidden]="extraHidden()"
      />
    }
    <!-- A column with neither columnId nor field is omitted from the catalog. -->
    @if (showInvalid()) {
      <sky-data-grid-column headingText="Invalid" />
    }
  </sky-data-grid>`,
  imports: [SkyDataGrid, SkyDataGridColumn],
})
export class ColumnSelectionTestComponent {
  public readonly data = input<{ id: string; name: string; age: number }[]>([
    { id: '1', name: 'Amy', age: 30 },
    { id: '2', name: 'Bob', age: 40 },
  ]);

  public readonly selectedColumnIds = model<string[]>([]);
  public readonly extraHidden = input<boolean>(false);
  public readonly lockedDescription = input<string | undefined>(undefined);
  public readonly showExtra = input<boolean>(true);
  public readonly showInvalid = input<boolean>(false);
}
