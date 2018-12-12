import {
  Component
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import {
  SkyGridMessageType,
  SkyGridMessage,
  SkyGridSelectedRowsModelChange
} from '../../public';

@Component({
  selector: 'grid-visual',
  templateUrl: './grid-visual.component.html'
})
export class GridVisualComponent {

  public highlightText: string;
  public selectedRows: string;
  public gridController = new Subject<SkyGridMessage>();

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

  public sortChangedSimpleGrid(activeSort: ListSortFieldSelectorModel) {
    this.dataForSimpleGrid = this.performSort(activeSort, this.dataForSimpleGrid);
  }

  public sortChangedMultiselectGrid(activeSort: ListSortFieldSelectorModel) {
    this.dataForSimpleGridWithMultiselect = this.performSort(activeSort, this.dataForSimpleGridWithMultiselect);
  }

  public triggerHighlight() {
    this.highlightText = 'e';
  }

  public onMultiselectSelectionChange(value: SkyGridSelectedRowsModelChange) {
    this.selectedRows = value.selectedRowIds.toString();
  }

  public selectAll() {
    this.sendMessage(SkyGridMessageType.SelectAll);
  }

  public clearAll() {
    this.sendMessage(SkyGridMessageType.ClearAll);
  }

  private performSort(activeSort: ListSortFieldSelectorModel, data: any[]) {
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

  private sendMessage(type: SkyGridMessageType) {
    const message: SkyGridMessage = { type };
    this.gridController.next(message);
  }
}
