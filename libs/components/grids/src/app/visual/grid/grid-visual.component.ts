import {
  Component
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder/modules/list/state';

@Component({
  selector: 'grid-visual',
  templateUrl: './grid-visual.component.html'
})
export class GridVisualComponent {

  public highlightText: string;

  public items = [
    new ListItemModel('1', { column1: '1', column2: 'Apple', column3: 'aa' }),
    new ListItemModel('2', { column1: '01', column2: 'Banana', column3: 'bb' }),
    new ListItemModel('3', { column1: '11', column2: 'Banana', column3: 'cc' }),
    new ListItemModel('4', { column1: '12', column2: 'Daikon', column3: 'dd' }),
    new ListItemModel('5', { column1: '13', column2: 'Edamame', column3: 'ee' }),
    new ListItemModel('6', { column1: '20', column2: 'Fig', column3: 'ff' }),
    new ListItemModel('7', { column1: '21', column2: 'Grape', column3: 'gg' })
  ];

  public triggerHighlight() {
    this.highlightText = 'e';
  }
}
