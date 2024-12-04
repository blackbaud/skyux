import { Injectable } from '@angular/core';

import { Observable, interval, map } from 'rxjs';

import { InfiniteScrollDemoItem } from './item';

const ITEMS_PER_PAGE = 10;
const MAX_ITEMS = 50;

@Injectable({ providedIn: 'root' })
export class DemoService {
  public getItems(page: number): Observable<{
    data: InfiniteScrollDemoItem[];
    hasMore: boolean;
  }> {
    console.log('getItems()', page);
    // Simulate an async request.
    return interval(1000).pipe(
      map(() => {
        let start = page * ITEMS_PER_PAGE;
        let end = start + ITEMS_PER_PAGE;

        const data: InfiniteScrollDemoItem[] = [];

        console.log('loadmore', start, end);

        for (let i = 1; i <= ITEMS_PER_PAGE; i++) {
          if (start + i <= MAX_ITEMS) {
            data.push({ name: `Item #${start + i}` });
          }
        }

        return { data, hasMore: end < MAX_ITEMS };
      }),
    );
  }
}
