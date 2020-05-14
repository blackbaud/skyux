import {
  Component
} from '@angular/core';

import {
  Observable,
  of as observableOf
} from 'rxjs';

@Component({
  selector: 'sky-list-toolbar-visual',
  templateUrl: './list-toolbar-visual.component.html'
})
export class ListToolbarVisualComponent {

  public data: Observable<Array<any>> = observableOf([
    { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples'},
    { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
    { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
    { id: '4', column1: 404, column2: 'Grape', column3: 'George eats grapes' },
    { id: '5', column1: 505, column2: 'Banana', column3: 'Becky eats bananas' },
    { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
    { id: '7', column1: 707, column2: 'Strawberry', column3: 'Sally eats strawberries' }
  ]);

  public iconGroupSelectedValue = 'table';

  public selectedIds: string[] = [];

  public fruitTypeFilterFunction(): boolean {
    return true;
  }

  public selectedIdsChange(data: any): void {
    console.log('selectedIdsChange:', data);
  }

  public onSelectRowsClick(): void {
    this.selectedIds = ['2', '3', '5'];
  }
}
