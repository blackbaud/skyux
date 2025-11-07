import { JsonPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import {
  SkyGridModule,
  SkyGridRowDeleteCancelArgs,
  SkyGridRowDeleteConfirmArgs,
} from '@skyux/grids';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

interface RowModel {
  id: string;
  column1: string;
  column2: string;
  column3: boolean;
  myId?: string;
}

@Component({
  selector: 'app-grid-test',
  templateUrl: './grid-test.component.html',
  imports: [SkyGridModule, SkyPopoverModule, SkyDropdownModule, JsonPipe],
})
export class GridTestComponent {
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

  public readonly displayedColumns = input<string[]>([]);
  public readonly removeRowIds = model<string[]>([]);
  public readonly rowHighlightedId = model<string | undefined>();
  public readonly selectedRowIds = model<string[]>([]);
  public readonly visibleColumnIds = model<string[]>([]);

  public page = 1;
  public pageSize = 0;
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
  public cancelRowDelete(_cancelArgs: SkyGridRowDeleteCancelArgs): void {
    // noop
  }

  public deleteItem(id: string): void {
    this.removeRowIds.update((removeRowIds) => [id, ...removeRowIds]);
  }

  public finishRowDelete(confirmArgs: SkyGridRowDeleteConfirmArgs): void {
    this.dataForRowDeleteGrid = (this.dataForRowDeleteGrid ?? []).filter(
      (data: RowModel) => data.id !== confirmArgs.id,
    );
  }

  public selectRow(): void {
    this.selectedRowIds.set(['101', '103', '105']);
  }
}
