import { JsonPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import {
  SkyAgGridRowDeleteCancelArgs,
  SkyAgGridRowDeleteConfirmArgs,
} from '@skyux/ag-grid';
import { SkyDataGridFilterValue } from '@skyux/data-grid';
import { SkyFilterBarFilterItem } from '@skyux/filter-bar';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

import { SkyDataGridFilterOperator } from '../../types/data-grid-filter-operator';
import { SkyDataGridSort } from '../../types/data-grid-sort';
import { SkyDataGridColumnComponent } from '../data-grid-column.component';
import { SkyDataGridComponent } from '../data-grid.component';

interface RowModel {
  id: string;
  column1: string;
  column2: string;
  column3: boolean;
  myId?: string;
}

interface FilteredRowModel {
  id: string;
  column1: string;
  column2: string | null;
  column3: boolean;
  numericColumn: number;
  dateColumn: string;
}

@Component({
  selector: 'app-data-grid-test',
  templateUrl: './data-grid-test.component.html',
  imports: [
    SkyDataGridComponent,
    SkyDataGridColumnComponent,
    SkyPopoverModule,
    SkyDropdownModule,
    JsonPipe,
  ],
})
export class DataGridTestComponent {
  public dataForRowDeleteGrid: RowModel[] | undefined = [
    { id: '1', column1: '1', column2: 'Apple', column3: true },
    { id: '2', column1: '01', column2: 'Banana', column3: false },
    { id: '3', column1: '11', column2: 'Banana', column3: true },
    { id: '4', column1: '12', column2: 'Daikon', column3: false },
    { id: '5', column1: '13', column2: 'Edamame', column3: true },
    { id: '6', column1: '20', column2: 'Fig', column3: false },
    { id: '7', column1: '21', column2: 'Grape', column3: true },
  ];

  public dataForSimpleGrid: RowModel[] | undefined = [
    { id: '1', column1: '1', column2: 'Apple', column3: true },
    { id: '2', column1: '01', column2: 'Banana', column3: false },
    { id: '3', column1: '11', column2: 'Banana', column3: true },
    { id: '4', column1: '12', column2: 'Daikon', column3: false },
    { id: '5', column1: '13', column2: 'Edamame', column3: true },
    { id: '6', column1: '20', column2: 'Fig', column3: false },
    { id: '7', column1: '21', column2: 'Grape', column3: true },
  ];

  public dataForSimpleGridWithMultiselect: RowModel[] | undefined = [
    { id: '1', column1: '1', column2: 'Apple', column3: true, myId: '101' },
    { id: '2', column1: '01', column2: 'Banana', column3: false, myId: '102' },
    { id: '3', column1: '11', column2: 'Banana', column3: true, myId: '103' },
    { id: '4', column1: '12', column2: 'Daikon', column3: false, myId: '104' },
    { id: '5', column1: '13', column2: 'Edamame', column3: true, myId: '105' },
    { id: '6', column1: '20', column2: 'Fig', column3: false, myId: '106' },
    { id: '7', column1: '21', column2: 'Grape', column3: true, myId: '107' },
  ];

  public dataForFilteredGrid: FilteredRowModel[] = [
    {
      id: '1',
      column1: '1',
      column2: 'Apple',
      column3: true,
      numericColumn: 100,
      dateColumn: new Date('2024-01-15T00:00:00.000Z').toISOString(),
    },
    {
      id: '2',
      column1: '01',
      column2: 'Banana',
      column3: false,
      numericColumn: 200,
      dateColumn: new Date('2024-02-20T00:00:00.000Z').toISOString(),
    },
    {
      id: '3',
      column1: '11',
      column2: 'Banana',
      column3: true,
      numericColumn: 150,
      dateColumn: new Date('2024-03-10T00:00:00.000Z').toISOString(),
    },
    {
      id: '4',
      column1: '12',
      column2: 'Daikon',
      column3: false,
      numericColumn: 250,
      dateColumn: new Date('2024-04-05T00:00:00.000Z').toISOString(),
    },
    {
      id: '5',
      column1: '13',
      column2: 'Edamame',
      column3: true,
      numericColumn: 175,
      dateColumn: new Date('2024-05-25T00:00:00.000Z').toISOString(),
    },
    {
      id: '6',
      column1: '20',
      column2: 'Fig',
      column3: false,
      numericColumn: 300,
      dateColumn: new Date('2024-06-30T00:00:00.000Z').toISOString(),
    },
    {
      id: '7',
      column1: '21',
      column2: 'Grape',
      column3: true,
      numericColumn: 125,
      dateColumn: new Date('2024-07-12T00:00:00.000Z').toISOString(),
    },
  ];

  public readonly displayedColumns = input<string[]>([]);
  public readonly appliedFilters = input<
    SkyFilterBarFilterItem<SkyDataGridFilterValue>[]
  >([]);
  public readonly removeRowIds = model<string[]>([]);
  public readonly rowHighlightedId = model<string | undefined>();
  public readonly selectedRowIds = model<string[]>([]);
  public readonly showFilteredGrid = input<boolean>(false);
  protected readonly showFilteredMultiselectGrid = input<boolean>(false);
  public readonly totalRowCount = input<number | undefined>();
  public readonly visibleColumnIds = model<string[]>([]);
  public readonly textFilterOperator = input<SkyDataGridFilterOperator>();
  public readonly numberFilterOperator = input<SkyDataGridFilterOperator>();
  public readonly booleanFilterOperator = input<SkyDataGridFilterOperator>();

  public readonly gridSort = model<SkyDataGridSort | undefined>(undefined);

  public readonly enableMultiselect = input<boolean>();
  public readonly height = input<number>();
  public readonly pageSize = input<number>();

  public page = 1;
  public pageQueryParam = '';

  protected readonly showAllColumns = input<boolean>(true);
  protected readonly showAllGrids = input<boolean>(true);
  protected readonly showCol3 = input<boolean>(true);
  protected readonly showCol3HeaderText = input<boolean>(true);

  readonly #cdr = inject(ChangeDetectorRef);

  public selectAll(): void {
    this.selectedRowIds.set(
      (this.dataForSimpleGridWithMultiselect ?? []).map(
        (item) => item.myId as string,
      ),
    );
    this.#cdr.markForCheck();
  }

  public clearAll(): void {
    this.selectedRowIds.set([]);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public cancelRowDelete(_cancelArgs: SkyAgGridRowDeleteCancelArgs): void {
    // noop
  }

  public deleteItem(id: string): void {
    this.removeRowIds.update((removeRowIds) => [id, ...removeRowIds]);
  }

  public finishRowDelete(confirmArgs: SkyAgGridRowDeleteConfirmArgs): void {
    this.dataForRowDeleteGrid = (this.dataForRowDeleteGrid ?? []).filter(
      (data: RowModel) => data.id !== confirmArgs.id,
    );
  }

  public selectRow(): void {
    this.selectedRowIds.set(['101', '103', '105']);
  }
}
