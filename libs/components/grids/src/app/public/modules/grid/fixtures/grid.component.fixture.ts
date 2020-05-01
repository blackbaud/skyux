import {
  Component,
  ViewChild,
  TemplateRef,
  ContentChildren,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  Subject
} from 'rxjs/Subject';

import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import {
  SkyGridComponent
} from '../grid.component';

import {
  SkyGridColumnWidthModelChange,
  SkyGridRowDeleteCancelArgs,
  SkyGridRowDeleteConfig,
  SkyGridRowDeleteConfirmArgs,
  SkyGridMessage,
  SkyGridSelectedRowsModelChange,
  SkyGridMessageType
} from '../types';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid.component.fixture.html'
})
export class GridTestComponent {

  public activeSortSelector: ListSortFieldSelectorModel;

  public columnWidthsChange: Array<SkyGridColumnWidthModelChange>;

  public data: any[] = [
    {
      id: '1',
      column1: '1',
      column2: 'Apple',
      column3: 1,
      column4: new Date().getTime() + 600000,
      customId: '101'
    },
    {
      id: '2',
      column1: '01',
      column2: 'Banana',
      column3: 1,
      column4: new Date().getTime() + 3600000,
      column5: 'test',
      customId: '102'
    },
    {
      id: '3',
      column1: '11',
      column2: 'Carrot',
      column3: 11,
      column4: new Date().getTime() + 2400000,
      customId: '103'
    },
    {
      id: '4',
      column1: '12',
      column2: 'Daikon',
      column3: 12,
      column4: new Date().getTime() + 1200000,
      customId: '104'
    },
    {
      id: '5',
      column1: '13',
      column2: 'Edamame',
      column3: 13,
      column4: new Date().getTime() + 3000000,
      customId: '105'
    },
    {
      id: '6',
      column1: '20',
      column2: 'Fig',
      column3: 20,
      column4: new Date().getTime() + 1800000,
      customId: '106'
    },
    {
      id: '7',
      column1: '21',
      column2: 'Some long text that would provoke an overflow of monster proportions!',
      column3: 21,
      column4: new Date().getTime() + 5600000,
      customId: '107'
    }
  ];

  public dynamicWidth: number;

  public enableMultiselect: boolean = false;

  public fitType: string = 'scroll';

  public gridController = new Subject<SkyGridMessage>();

  public hasToolbar = false;

  public rowDeleteConfigs: SkyGridRowDeleteConfig[] = [];

  public multiselectRowId: string;

  public rowHighlightedId: string;

  public searchedData: any;

  public searchText: string;

  public selectedRowsChange: SkyGridSelectedRowsModelChange;

  public selectedRowIds: Array<string>;

  public settingsKey: string;

  public set showWideColumn(showCol: boolean) {
    if (showCol) {
      this.selectedColumnIds.push('column6');
    } else {
      this.selectedColumnIds = this.selectedColumnIds.filter(id => id !== 'column6');
    }

    this._showWideColumn = showCol;
  }

  public get showWideColumn(): boolean {
    return this._showWideColumn;
  }

  public sortField: ListSortFieldSelectorModel;

  public selectedColumnIds: string[] = [
    'column1',
    'column2',
    'column3',
    'column4',
    'column5'
  ];

  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent;

  @ContentChildren(TemplateRef)
  public templates: QueryList<TemplateRef<any>>;

  @ViewChildren(TemplateRef)
  public viewtemplates: QueryList<TemplateRef<any>>;

  public _showWideColumn: boolean = false;

  public searchFunction: (data: any, searchText: string) => boolean =
    (data: any, searchText: string) => {
      this.searchedData = data;
      this.searchText = searchText;
      return true;
    }

  public onSort(sortSelector: ListSortFieldSelectorModel): void {
    this.activeSortSelector = sortSelector;
    const sortField = sortSelector.fieldSelector;
    const descending = sortSelector.descending;
    this.data = this.data.sort((a: any, b: any) => {
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

  public onResize(columnWidths: Array<SkyGridColumnWidthModelChange>): void {
    this.columnWidthsChange = columnWidths;
  }

  public onMultiselectChange(selectedRows: SkyGridSelectedRowsModelChange): void {
    this.selectedRowsChange = selectedRows;
  }

  public addLongData() {
    this.data = [{
      id: '8',
      column1: 'Some long text that would provoke an overflow of monster proportions!',
      column2: 'Some long text that would provoke an overflow of monster proportions!',
      column3: 'Some long text that would provoke an overflow of monster proportions!',
      column4: 21,
      column5: new Date().getTime() + 5600000,
      customId: '107'
    }];
  }

  public hideColumn(): void {
    this.selectedColumnIds = ['column1', 'column3', 'column4', 'column5'];

    if (this.showWideColumn) {
      this.selectedColumnIds.push('column6');
    }
  }

  public showColumn(): void {
    this.selectedColumnIds = ['column1', 'column2', 'column3', 'column4', 'column5'];

    if (this.showWideColumn) {
      this.selectedColumnIds.push('column6');
    }
  }

  public cancelRowDelete(cancelArgs: SkyGridRowDeleteCancelArgs): void {
    this.gridController.next({
      type: SkyGridMessageType.AbortDeleteRow,
      data: {
        abortDeleteRow: {
          id: cancelArgs.id
        }
      }
    });
  }

  public deleteItem(id: string): void {
    this.gridController.next({
      type: SkyGridMessageType.PromptDeleteRow,
      data: {
        promptDeleteRow: {
          id: id
        }
      }
    });
  }

  public finishRowDelete(confirmArgs: SkyGridRowDeleteConfirmArgs): void {
    return;
  }
}
