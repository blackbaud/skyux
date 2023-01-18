import { Component, OnInit } from '@angular/core';

import { InfiniteScrollDemoItem } from './infinite-scroll-demo-item';

let nextId = 0;

@Component({
  selector: 'app-infinite-scroll-demo',
  templateUrl: './infinite-scroll-demo.component.html',
})
export class InfiniteScrollDemoComponent implements OnInit {
  public items: InfiniteScrollDemoItem[] = [];

  public itemsHaveMore = true;

  public ngOnInit(): void {
    this.addData();
  }

  public onScrollEnd(): void {
    if (this.itemsHaveMore) {
      this.addData();
    }
  }

  private addData(): void {
    this.mockRemote().then(
      (result: { data: InfiniteScrollDemoItem[]; hasMore: boolean }) => {
        this.items = this.items.concat(result.data);
        this.itemsHaveMore = result.hasMore;
      }
    );
  }

  private mockRemote(): Promise<{
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
