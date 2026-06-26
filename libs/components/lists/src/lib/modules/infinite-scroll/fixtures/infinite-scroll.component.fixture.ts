import { Component, ElementRef, ViewChild, input, signal } from '@angular/core';

import { SkyInfiniteScrollComponent } from '../infinite-scroll.component';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './infinite-scroll.component.fixture.html',
  standalone: false,
})
export class SkyInfiniteScrollTestComponent {
  @ViewChild('infiniteScrollComponent', {
    read: SkyInfiniteScrollComponent,
    static: true,
  })
  public infiniteScrollComponent!: SkyInfiniteScrollComponent;

  @ViewChild('wrapper', {
    read: ElementRef,
    static: true,
  })
  public wrapper: ElementRef | undefined;

  public enabled = input<boolean | undefined>(undefined);

  public loading = input<boolean | undefined>(undefined);

  public items = signal<Record<string, any>[]>([]);

  public onScrollEnd(): void {
    const num: number = this.items().length;
    const newItems: Record<string, any>[] = [];
    for (let i: number = num; i < num + 10; i++) {
      newItems.push({
        name: `test object: #${i}`,
      });
    }
    this.items.update((arr) => [...arr, ...newItems]);
  }

  public loadItems(numItems: number): void {
    const newItems: Record<string, any>[] = [];
    for (let i = 0; i < numItems; i++) {
      newItems.push({
        name: 'test object: #' + i,
      });
    }
    this.items.set(newItems);
  }
}
