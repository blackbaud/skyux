import { Component, OnInit } from '@angular/core';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

import { InfiniteScrollDemoItem } from './item';

let nextId = 0;

/**
 * @title Infinite scroll with repeater
 */
@Component({
  selector: 'app-lists-infinite-scroll-repeater-example',
  styles: `
    .wrapper {
      overflow-y: auto;
      max-height: 500px;
      position: relative;
    }
  `,
  templateUrl: './example.component.html',
  imports: [SkyInfiniteScrollModule, SkyRepeaterModule],
})
export class ListsInfiniteScrollRepeaterExampleComponent implements OnInit {
  protected items: InfiniteScrollDemoItem[] = [];
  protected itemsHaveMore = true;

  public ngOnInit(): void {
    void this.#addData();
  }

  protected onScrollEnd(): void {
    if (this.itemsHaveMore) {
      void this.#addData();
    }
  }

  async #addData(): Promise<void> {
    const result = await this.#mockRemote();
    this.items = this.items.concat(result.data);
    this.itemsHaveMore = result.hasMore;
  }

  #mockRemote(): Promise<{
    data: InfiniteScrollDemoItem[];
    hasMore: boolean;
  }> {
    const data: InfiniteScrollDemoItem[] = [];

    for (let i = 0; i < 20; i++) {
      data.push({
        name: `Item #${++nextId}`,
      });
    }

    // Simulate async request.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data,
          hasMore: nextId < 50,
        });
      }, 1000);
    });
  }
}
