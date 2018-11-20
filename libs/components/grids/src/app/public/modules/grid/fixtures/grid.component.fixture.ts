import {
  Component,
  ViewChild,
  TemplateRef,
  ContentChildren,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  ListItemModel,
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import { SkyGridComponent } from '../grid.component';

import { SkyGridColumnWidthModelChange } from '../types';

const moment = require('moment');

@Component({
  selector: 'sky-test-cmp',
  template: require('./grid.component.fixture.html')
})
export class GridTestComponent {
  @ViewChild(SkyGridComponent)
  public grid: SkyGridComponent;

  @ContentChildren(TemplateRef)
  public templates: QueryList<TemplateRef<any>>;

  @ViewChildren(TemplateRef)
  public viewtemplates: QueryList<TemplateRef<any>>;

  public hasToolbar = false;
  public searchedData: any;
  public searchText: string;
  public activeSortSelector: ListSortFieldSelectorModel;
  public sortField: ListSortFieldSelectorModel;
  public columnWidthsChange: Array<SkyGridColumnWidthModelChange>;
  public fitType: string = 'scroll';

  public selectedColumnIds: string[] = [
    'column1',
    'column2',
    'column3',
    'column4',
    'column5'
  ];

  public data: any[] = [
    new ListItemModel('1', {
      column1: '1',
      column2: 'Apple',
      column3: 1,
      column4: moment().add(1, 'minute')
    }),
    new ListItemModel('2', {
      column1: '01',
      column2: 'Banana',
      column3: 1,
      column4: moment().add(6, 'minute'),
      column5: 'test'
    }),
    new ListItemModel('3', {
      column1: '11',
      column2: 'Carrot',
      column3: 11,
      column4: moment().add(4, 'minute')
    }),
    new ListItemModel('4', {
      column1: '12',
      column2: 'Daikon',
      column3: 12,
      column4: moment().add(2, 'minute')
    }),
    new ListItemModel('5', {
      column1: '13',
      column2: 'Edamame',
      column3: 13,
      column4: moment().add(5, 'minute')
    }),
    new ListItemModel('6', {
      column1: '20',
      column2: 'Fig',
      column3: 20,
      column4: moment().add(3, 'minute')
    }),
    new ListItemModel('7', {
      column1: '21',
      column2: 'Some long text that would provoke an overflow of monster proportions!',
      column3: 21,
      column4: moment().add(7, 'minute')
    })
  ];

  public searchFunction: (data: any, searchText: string) => boolean =
    (data: any, searchText: string) => {
      this.searchedData = data;
      this.searchText = searchText;
      return true;
    }

  public onSort(sortSelector: ListSortFieldSelectorModel) {
    this.activeSortSelector = sortSelector;
  }

  public onResize(columnWidths: Array<SkyGridColumnWidthModelChange>) {
    this.columnWidthsChange = columnWidths;
  }

  public hideColumn() {
    this.selectedColumnIds = ['column1', 'column3', 'column4', 'column5'];
  }

  public showColumn() {
    this.selectedColumnIds = ['column1', 'column2', 'column3', 'column4', 'column5'];
  }
}
