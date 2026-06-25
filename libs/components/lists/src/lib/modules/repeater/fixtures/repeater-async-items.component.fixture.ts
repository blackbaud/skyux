import { Component, OnInit } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'sky-test-cmp',
  template: `
    <sky-repeater [activeIndex]="activeIndex">
      @for (item of asyncData | async; track item.id) {
        <sky-repeater-item>
          <sky-repeater-item-title>
            {{ item.title }}
          </sky-repeater-item-title>
        </sky-repeater-item>
      }
    </sky-repeater>
  `,
  standalone: false,
})
export class RepeaterAsyncItemsTestComponent implements OnInit {
  public activeIndex: number | undefined;

  public asyncData = new BehaviorSubject<any[]>([]);

  public items = [
    {
      id: 'item1',
      title: 'Item 1',
    },
    {
      id: 'item2',
      title: 'Item 2',
    },
    {
      id: 'item3',
      title: 'Item 3',
    },
  ];

  public ngOnInit() {
    setTimeout(() => {
      this.asyncData.next(this.items);
    }, 1000);
  }
}
