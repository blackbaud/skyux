import {
  Component,
  OnInit
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <sky-repeater
      [activeIndex]="activeIndex"
    >
      <sky-repeater-item *ngFor="let item of asyncData | async">
        <sky-repeater-item-title>
          {{ item.title }}
        </sky-repeater-item-title>
      </sky-repeater-item>
    </sky-repeater>
  `
})
export class RepeaterAsyncItemsTestComponent implements OnInit {

  public activeIndex: number;

  public asyncData = new BehaviorSubject<any[]>([]);

  public items = [
    {
      id: 'item1',
      title: 'Item 1'
    },
    {
      id: 'item2',
      title: 'Item 2'
    },
    {
      id: 'item3',
      title: 'Item 3'
    }
  ];

  public ngOnInit() {
    setTimeout(() => {
      this.asyncData.next(this.items);
    }, 1000);
  }
}
