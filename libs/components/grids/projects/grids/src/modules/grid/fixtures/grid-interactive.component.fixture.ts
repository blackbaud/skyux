import {
  Component,
  ViewChild,
  TemplateRef,
  ContentChildren,
  QueryList,
  ViewChildren
} from '@angular/core';

import {
  ListSortFieldSelectorModel
} from '@skyux/list-builder-common';

import {
  SkyGridComponent
} from '../grid.component';

import {
  SkyGridColumnWidthModelChange
} from '../types/grid-column-width-model-change';

import {
  SkyGridSelectedRowsModelChange
} from '../types/grid-selected-rows-model-change';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './grid-interactive.component.fixture.html'
})
export class GridInteractiveTestComponent {
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
  public enableMultiselect: boolean = true;
  public multiselectRowId: string;
  public selectedRowsChange: SkyGridSelectedRowsModelChange;

  public selectedColumnIds: string[] = [
    'column1',
    'column2',
    'column3'
  ];

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
      column3: 11
    },
    {
      id: '4',
      column1: '12',
      column2: 'Daikon',
      column3: 12
    },
    {
      id: '5',
      column1: '13',
      column2: 'Edamame',
      column3: 13
    },
    {
      id: '6',
      column1: '20',
      column2: 'Fig',
      column3: 20
    },
    {
      id: '7',
      column1: '21',
      column2: 'Some long text that would provoke an overflow of monster proportions!',
      column3: 21
    }
  ];
}
