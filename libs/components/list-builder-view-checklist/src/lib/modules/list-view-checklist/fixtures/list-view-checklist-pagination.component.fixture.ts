import { Component } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-view-checklist-pagination.component.fixture.html',
})
export class ListViewChecklistPaginationTestComponent {
  public selectedItems: Map<string, boolean>;
  public selectMode = 'multiple';
  public showOnlySelected = false;

  public items: Observable<Array<any>> = observableOf([
    { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples' },
    { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
    { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
    { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
    { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
    { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
    {
      id: '7',
      column1: 707,
      column2: 'Strawberry',
      column3: 'Sally eats strawberries',
    },
    { id: '8', column1: 808, column2: 'Apple', column3: 'Anne eats apples' },
    { id: '9', column1: 909, column2: 'baz', column3: 'Anne eats baz' },
    { id: '10', column1: 1010, column2: 'bar', column3: 'Anne eats bar' },
    { id: '11', column1: 1111, column2: 'foo', column3: 'Anne eats foo' },
  ]);

  public selectedItemsChange(selectedMap: Map<string, boolean>) {
    this.selectedItems = selectedMap;
  }
}
