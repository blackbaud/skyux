import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SkyFilterItemLookupSearchAsyncResult } from '@skyux/filter-bar';

import { ExampleService } from './example.service';

describe('AG Grid data entry grid data manager example service', () => {
  function search(
    searchText: string,
  ): SkyFilterItemLookupSearchAsyncResult | undefined {
    let result: SkyFilterItemLookupSearchAsyncResult | undefined;

    TestBed.inject(ExampleService)
      .search(searchText)
      .subscribe((value) => (result = value));

    // The service simulates network latency of 800 milliseconds.
    tick(800);

    return result;
  }

  it('should return job titles that contain the search text, ignoring case', fakeAsync(() => {
    expect(search('aCcOuNt')).toEqual({
      hasMore: false,
      items: [
        { id: '5', name: 'Account Executive' },
        { id: '12', name: 'Account Manager' },
      ],
      totalCount: 2,
    });
  }));

  it('should return all job titles when the search text is empty', fakeAsync(() => {
    expect(search('')?.totalCount).toBe(13);
  }));

  it('should return an empty result when nothing matches', fakeAsync(() => {
    expect(search('astronaut')?.items).toEqual([]);
  }));
});
