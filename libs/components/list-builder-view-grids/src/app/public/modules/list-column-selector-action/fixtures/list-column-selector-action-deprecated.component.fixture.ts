import {
  Component,
  ViewChild
} from '@angular/core';

import {
  Observable
} from 'rxjs/Observable';
import 'rxjs/Rx';

import {
  SkyListViewGridComponent
} from '../../list-view-grid';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './list-column-selector-action-deprecated.component.fixture.html'
})
export class ListColumnSelectorActionDeprecatedTestComponent {
  public items: Observable<Array<any>> = Observable.of([
    { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples' },
    { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
    { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
    { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
    { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
    { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
    { id: '7', column1: 707, column2: 'Strawberry', column3: 'Sally eats strawberries' }
  ]);

  @ViewChild(SkyListViewGridComponent)
  public grid: SkyListViewGridComponent;
}
