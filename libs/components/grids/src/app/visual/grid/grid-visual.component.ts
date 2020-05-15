import {
  Component,
  ViewChild
} from '@angular/core';

import {
  Subject
} from 'rxjs';

import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import {
  SkyGridMessage,
  SkyGridMessageType,
  SkyGridRowDeleteCancelArgs,
  SkyGridRowDeleteConfirmArgs,
  SkyGridSelectedRowsModelChange
} from '../../public/public_api';

@Component({
  selector: 'grid-visual',
  templateUrl: './grid-visual.component.html',
  styleUrls: ['./grid-visual.component.scss']
})
export class GridVisualComponent {

  public asyncPopover: any;

  public dataForRowDeleteGrid: any = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg' }
  ];

  public dataForSimpleGrid = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg' }
  ];

  public dataForSimpleGridWithMultiselect = [
    { id: '1', column1: '1', column2: 'Apple', column3: 'aa', myId: '101' },
    { id: '2', column1: '01', column2: 'Banana', column3: 'bb', myId: '102' },
    { id: '3', column1: '11', column2: 'Banana', column3: 'cc', myId: '103' },
    { id: '4', column1: '12', column2: 'Daikon', column3: 'dd', myId: '104' },
    { id: '5', column1: '13', column2: 'Edamame', column3: 'ee', myId: '105' },
    { id: '6', column1: '20', column2: 'Fig', column3: 'ff', myId: '106' },
    { id: '7', column1: '21', column2: 'Grape', column3: 'gg', myId: '107' }
  ];

  public gridController = new Subject<SkyGridMessage>();

  public gridRowDeleteController = new Subject<SkyGridMessage>();

  public highlightText: string;

  public rowHighlightedId: string;

  public selectedRowIds: string[];

  public selectedRowIdsDisplay: string[];

  public selectedRows: string;

  @ViewChild('asyncPopoverRef')
  private popoverTemplate: any;

  constructor() {
    setTimeout(() => {
      this.asyncPopover = this.popoverTemplate;
    }, 1000);
  }

  public sortChangedSimpleGrid(activeSort: ListSortFieldSelectorModel): void {
    this.dataForSimpleGrid = this.performSort(activeSort, this.dataForSimpleGrid);
  }

  public sortChangedMultiselectGrid(activeSort: ListSortFieldSelectorModel): void {
    this.dataForSimpleGridWithMultiselect = this.performSort(activeSort, this.dataForSimpleGridWithMultiselect);
  }

  public triggerTextHighlight(): void {
    this.highlightText = 'e';
  }

  public triggerRowHighlight(): void {
    if (!this.rowHighlightedId) {
      this.rowHighlightedId = '2';
    } else {
      this.rowHighlightedId = undefined;
    }
  }

  public onMultiselectSelectionChange(value: SkyGridSelectedRowsModelChange): void {
    this.selectedRowIdsDisplay = value.selectedRowIds;
    console.log(value);
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
          id: id
        }
      }
    });
  }

  public finishRowDelete(confirmArgs: SkyGridRowDeleteConfirmArgs): void {
    setTimeout(() => {
      console.log('Item with id ' + confirmArgs.id + ' has been deleted');
      // IF WORKED
      this.dataForRowDeleteGrid = this.dataForRowDeleteGrid
        .filter((data: any) => data.id !== confirmArgs.id);
    }, 5000);
  }

  public selectRow(): void {
    this.selectedRowIds = ['2', '5', '7'];
  }

  private performSort(activeSort: ListSortFieldSelectorModel, data: any[]): Array<any> {
    const sortField = activeSort.fieldSelector;
    const descending = activeSort.descending;

    return data.sort((a: any, b: any) => {
      let value1 = a[sortField];
      let value2 = b[sortField];

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
    }).slice();
  }

  private sendMessage(type: SkyGridMessageType): void {
    const message: SkyGridMessage = { type };
    this.gridController.next(message);
  }
}
