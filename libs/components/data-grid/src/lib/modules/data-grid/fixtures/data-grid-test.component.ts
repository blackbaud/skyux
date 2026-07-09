import { JsonPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

import { SkyDataGridSort } from '../../types/data-grid-sort';
import { SkyDataGrid } from '../data-grid';
import { SkyDataGridColumn } from '../data-grid-column';

interface RowModel {
  id: string;
  column1: string;
  column2: string;
  column3: boolean;
  myId?: string;
}

@Component({
  selector: 'app-data-grid-test',
  templateUrl: './data-grid-test.component.html',
  imports: [
    SkyDataGrid,
    SkyDataGridColumn,
    SkyPopoverModule,
    SkyDropdownModule,
    JsonPipe,
  ],
})
export class DataGridTestComponent {
  public readonly dataForSimpleGrid = input<RowModel[] | undefined>([
    { id: '1', column1: '1', column2: 'Apple', column3: true },
    { id: '2', column1: '01', column2: 'Banana', column3: false },
    { id: '3', column1: '11', column2: 'Banana', column3: true },
    { id: '4', column1: '12', column2: 'Daikon', column3: false },
    { id: '5', column1: '13', column2: 'Edamame', column3: true },
    { id: '6', column1: '20', column2: 'Fig', column3: false },
    { id: '7', column1: '21', column2: 'Grape', column3: true },
  ]);

  public readonly dataForSimpleGridWithMultiselect = input<
    RowModel[] | undefined
  >([
    { id: '1', column1: '1', column2: 'Apple', column3: true, myId: '101' },
    { id: '2', column1: '01', column2: 'Banana', column3: false, myId: '102' },
    { id: '3', column1: '11', column2: 'Banana', column3: true, myId: '103' },
    { id: '4', column1: '12', column2: 'Daikon', column3: false, myId: '104' },
    { id: '5', column1: '13', column2: 'Edamame', column3: true, myId: '105' },
    { id: '6', column1: '20', column2: 'Fig', column3: false, myId: '106' },
    { id: '7', column1: '21', column2: 'Grape', column3: true, myId: '107' },
  ]);

  public readonly selectedRowIds = model<string[]>([]);

  public readonly sort = model<SkyDataGridSort | undefined>(undefined);

  public readonly autoPage = input<boolean>(true);
  public readonly autoSort = input<boolean>(true);
  public readonly labelText = input<string>();
  public readonly minHeight = input<number>();
  public readonly multiselect = input<boolean>();
  public readonly pageSize = input<number>();
  public readonly rowCount = input<number>();
  public readonly stacked = input<boolean>(false);

  public page = model(1);
  public pageQueryParam = input('');

  protected readonly showAllColumns = input<boolean>(true);
  protected readonly showAllGrids = input<boolean>(true);
  protected readonly showCol3 = input<boolean>(true);
  protected readonly showCol3HeaderText = input<boolean>(true);

  readonly #cdr = inject(ChangeDetectorRef);

  public selectAll(): void {
    this.selectedRowIds.set(
      (this.dataForSimpleGridWithMultiselect() ?? []).map(
        (item) => item.myId as string,
      ),
    );
    this.#cdr.markForCheck();
  }

  public clearAll(): void {
    this.selectedRowIds.set([]);
  }

  public selectRow(): void {
    this.selectedRowIds.set(['1', '3', '5']);
  }
}
