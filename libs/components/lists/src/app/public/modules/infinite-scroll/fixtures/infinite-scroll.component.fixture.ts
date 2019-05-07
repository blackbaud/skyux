import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

import {
  SkyInfiniteScrollComponent
} from '../infinite-scroll.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './infinite-scroll.component.fixture.html'
})
export class SkyInfiniteScrollTestComponent {
  @ViewChild('infiniteScrollComponent')
  public infiniteScrollComponent: SkyInfiniteScrollComponent;

  @ViewChild('wrapper')
  public wrapper: ElementRef;

  public enabled: boolean;
  public items: object[] = [];

  public onScrollEnd(): void {
    const num: number = this.items.length;
    for (let i: number = num; i < num + 10; i++) {
      this.items.push({
        name: `test object: #${i}`
      });
    }
  }

  public loadItems(numItems: number): void {
    this.items = [];
    for (let i = 0; i < numItems; i++) {
      this.items.push({
        name: 'test object: #' + i
      });
    }
  }
}
