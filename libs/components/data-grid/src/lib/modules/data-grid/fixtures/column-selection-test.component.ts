import { Component, input, model } from '@angular/core';

import { SkyDataGridSort } from '../../types/data-grid-sort';
import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

@Component({
  selector: 'app-column-selection-test',
  template: `<sky-data-grid
    [columnFit]="columnFit()"
    [data]="data()"
    [multiselect]="multiselect()"
    [(selectedColumnIds)]="selectedColumnIds"
    [(selectedRowIds)]="selectedRowIds"
    [(sort)]="sort"
  >
    <sky-data-grid-column
      columnId="locked"
      headingText="Locked"
      locked
      [description]="lockedDescription()"
    />
    <sky-data-grid-column
      field="name"
      headingText="Name"
      [flexWidth]="nameFlexWidth()"
    />
    <sky-data-grid-column
      field="age"
      headingText="Age"
      dataType="number"
      width="100"
    />
    @if (showExtra()) {
      <sky-data-grid-column
        field="extra"
        headingText="Extra"
        [columnHidden]="extraHidden()"
      />
    }
    @if (showDuplicateName()) {
      <sky-data-grid-column field="name" headingText="Name again" />
    }
    <!-- A column with neither columnId nor field is omitted from the column options. -->
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

  public readonly selectedColumnIds = model<string[] | undefined>();
  public readonly selectedRowIds = model<string[]>([]);
  public readonly sort = model<SkyDataGridSort | undefined>();
  public readonly columnFit = input<'container' | 'content'>('container');
  public readonly extraHidden = input<boolean>(false);
  public readonly lockedDescription = input<string | undefined>(undefined);
  public readonly multiselect = input<boolean>(false);
  public readonly nameFlexWidth = input<number | undefined>(1);
  public readonly showDuplicateName = input<boolean>(false);
  public readonly showExtra = input<boolean>(true);
  public readonly showInvalid = input<boolean>(false);
}
