import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

import { InfiniteScrollDemoItem } from './item';

let nextId = 0;

@Component({
  standalone: true,
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [CommonModule, SkyInfiniteScrollModule, SkyRepeaterModule],
})
export class DemoComponent implements OnInit {
  protected items: InfiniteScrollDemoItem[] = [];
  protected itemsHaveMore = true;

  public ngOnInit(): void {
    this.#addData();
  }

  protected onScrollEnd(): void {
    if (this.itemsHaveMore) {
      this.#addData();
    }
  }

  #addData(): void {
    this.#mockRemote().then(
      (result: { data: InfiniteScrollDemoItem[]; hasMore: boolean }) => {
        this.items = this.items.concat(result.data);
        this.itemsHaveMore = result.hasMore;
      },
    );
  }

  #mockRemote(): Promise<{
    data: InfiniteScrollDemoItem[];
    hasMore: boolean;
  }> {
    const data: InfiniteScrollDemoItem[] = [];

    for (let i = 0; i < 8; i++) {
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
