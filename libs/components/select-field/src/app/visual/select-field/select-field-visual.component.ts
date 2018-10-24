import {
  Component
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'select-field-visual',
  templateUrl: './select-field-visual.component.html'
})
export class SelectFieldVisualComponent {
  public staticData = [
    { id: '1', category: 'Pome', label: 'Apple', description: 'Anne eats apples' },
    { id: '2', category: 'Berry', label: 'Banana', description: 'Ben eats bananas' },
    { id: '3', category: 'Pome', label: 'Pear', description: 'Patty eats pears' },
    { id: '4', category: 'Berry', label: 'Grape', description: 'George eats grapes' },
    { id: '5', category: 'Berry', label: 'Banana', description: 'Becky eats bananas' },
    { id: '6', category: 'Citrus', label: 'Lemon', description: 'Larry eats lemons' },
    { id: '7', category: 'Aggregate fruit', label: 'Strawberry', description: 'Sally eats strawberries' }
  ];

  public data = new BehaviorSubject<any[]>(this.staticData);
  public model: any = {};

  public populateSelected() {
    this.model.multiple = [
      this.staticData[1],
      this.staticData[2],
      this.staticData[3]
    ];
    this.model.single = this.staticData[3];
  }
}
