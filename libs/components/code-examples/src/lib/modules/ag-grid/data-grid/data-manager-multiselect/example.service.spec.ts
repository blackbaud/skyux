import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SkyFilterItemLookupSearchAsyncResult } from '@skyux/filter-bar';

import { ExampleService } from './example.service';

describe('Data manager multiselect example service', () => {
  function search(
    searchText: string,
  ): SkyFilterItemLookupSearchAsyncResult | undefined {
    let result: SkyFilterItemLookupSearchAsyncResult | undefined;

    TestBed.inject(ExampleService)
      .search(searchText)
      .subscribe((value) => (result = value));

    // The service simulates network latency.
    expect(result).toBeUndefined();
    tick(800);

    return result;
  }

  it('should return job titles that match the search text regardless of case', fakeAsync(() => {
    expect(search('SOFTWARE engineer')).toEqual({
      hasMore: false,
      items: [
        { id: '6', name: 'Software Engineer' },
        { id: '7', name: 'Senior Software Engineer' },
        { id: '8', name: 'Principal Software Engineer' },
      ],
      totalCount: 3,
    });
  }));

  it('should return every job title when the search text is empty', fakeAsync(() => {
    expect(search('')?.totalCount).toBe(13);
  }));

  it('should return no job titles when nothing matches', fakeAsync(() => {
    expect(search('astronaut')).toEqual({
      hasMore: false,
      items: [],
      totalCount: 0,
    });
  }));
});
