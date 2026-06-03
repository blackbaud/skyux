import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import {
  SkyGridMessage,
  SkyGridMessageType,
  SkyGridModule,
  SkyGridRowDeleteCancelArgs,
  SkyGridRowDeleteConfirmArgs,
  SkyGridSelectedRowsModelChange,
} from '@skyux/grids';
import { ListSortFieldSelectorModel } from '@skyux/list-builder-common';
import { SkyDropdownModule, SkyPopoverModule } from '@skyux/popovers';

import { Subject } from 'rxjs';

interface GridRowData {
  id: string;
  column1: string;
  column2: string;
  column3: string;
  myId?: string;
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid-variations.component.html',
  styleUrls: ['./grid-variations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyGridModule, SkyPopoverModule, SkyDropdownModule],
})
export default class GridVariationsComponent {
  public asyncPopover = signal<unknown>(undefined);

  public dataForRowDeleteGrid: GridRowData[] = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg' },
  ];

  public dataForSimpleGrid: GridRowData[] = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg' },
  ];

  public dataForSimpleGridWithMultiselect: GridRowData[] = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa', myId: '101' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb', myId: '102' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc', myId: '103' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd', myId: '104' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee', myId: '105' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff', myId: '106' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg', myId: '107' },
  ];

  public columnsForSimpleGrid = signal(['column1', 'column2', 'column3']);

  public sortFieldForSimpleGrid = signal<ListSortFieldSelectorModel>({
    descending: true,
    fieldSelector: 'column2',
  });

  public gridController = new Subject<SkyGridMessage>();

  public gridRowDeleteController = new Subject<SkyGridMessage>();

  public highlightText = signal<string | undefined>(undefined);

  public rowHighlightedId = signal<string | undefined>(undefined);

  public selectedRowIds = signal<string[] | undefined>(undefined);

  public selectedRowIdsDisplay = signal<string[] | undefined>(undefined);

  public selectedRows = signal<string | undefined>(undefined);

  @ViewChild('asyncPopoverRef')
  private popoverTemplate: unknown;

  constructor() {
    setTimeout(() => {
      this.asyncPopover.set(this.popoverTemplate);
    }, 1000);
  }

  public toggleCol3(): void {
    this.columnsForSimpleGrid.update((cols) => {
      const col3Index = cols.indexOf('column3');
      if (col3Index === -1) {
        return [...cols, 'column3'];
      } else {
        return cols.filter((c) => c !== 'column3');
      }
    });
  }

  public sortChangedSimpleGrid(activeSort: ListSortFieldSelectorModel): void {
    this.dataForSimpleGrid = this.performSort(
      activeSort,
      this.dataForSimpleGrid,
    );
  }

  public sortChangedMultiselectGrid(
    activeSort: ListSortFieldSelectorModel,
  ): void {
    this.dataForSimpleGridWithMultiselect = this.performSort(
      activeSort,
      this.dataForSimpleGridWithMultiselect,
    );
  }

  public triggerTextHighlight(): void {
    this.highlightText.update((val) => (val ? undefined : 'e'));
  }

  public triggerRowHighlight(): void {
    this.rowHighlightedId.update((val) => (val ? undefined : '2'));
  }

  public onMultiselectSelectionChange(
    value: SkyGridSelectedRowsModelChange,
  ): void {
    this.selectedRowIdsDisplay.set(value.selectedRowIds);
  }

  public selectAll(): void {
    this.sendMessage(SkyGridMessageType.SelectAll);
  }

  public clearAll(): void {
    this.sendMessage(SkyGridMessageType.ClearAll);
  }

  public cancelRowDelete(cancelArgs: SkyGridRowDeleteCancelArgs): void {
    console.log('Item with id ' + cancelArgs.id + ' has not been deleted');
  }

  public deleteItem(id: string): void {
    this.gridRowDeleteController.next({
      type: SkyGridMessageType.PromptDeleteRow,
      data: {
        promptDeleteRow: {
          id: id,
        },
      },
    });
  }

  public finishRowDelete(confirmArgs: SkyGridRowDeleteConfirmArgs): void {
    setTimeout(() => {
      console.log('Item with id ' + confirmArgs.id + ' has been deleted');
      // IF WORKED
      this.dataForRowDeleteGrid = this.dataForRowDeleteGrid.filter(
        (data) => data.id !== confirmArgs.id,
      );
    }, 5000);
  }

  public selectRow(): void {
    this.selectedRowIds.set(['101', '103', '105']);
  }

  public onSelectedColumnIdsChange(event: string[]): void {
    console.log(event);
  }

  public onColumnWidthChange(event: { columnId: string; width: number }): void {
    console.log(event);
  }

  private performSort(
    activeSort: ListSortFieldSelectorModel,
    data: GridRowData[],
  ): GridRowData[] {
    const sortField = activeSort.fieldSelector;
    const descending = activeSort.descending;

    return data
      .sort((a, b) => {
        const rowA = a as unknown as Record<string, string>;
        const rowB = b as unknown as Record<string, string>;
        let value1 = rowA[sortField];
        let value2 = rowB[sortField];

        if (value1 && typeof value1 === 'string') {
          value1 = value1.toLowerCase();
        }

        if (value2 && typeof value2 === 'string') {
          value2 = value2.toLowerCase();
        }

        if (value1 === value2) {
          return 0;
        }

        let result = value1 > value2 ? 1 : -1;

        if (descending) {
          result *= -1;
        }

        return result;
      })
      .slice();
  }

  private sendMessage(type: SkyGridMessageType): void {
    const message: SkyGridMessage = { type };
    this.gridController.next(message);
  }
}
