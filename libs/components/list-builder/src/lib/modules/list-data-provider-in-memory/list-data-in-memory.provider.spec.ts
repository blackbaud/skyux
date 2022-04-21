import { fakeAsync, tick } from '@angular/core/testing';
import { ListItemModel } from '@skyux/list-builder-common';

import { Observable, of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

import { ListFilterModel } from '../list-filters/filter.model';
import { ListDataRequestModel } from '../list/list-data-request.model';

import { SkyListInMemoryDataProvider } from './list-data-in-memory.provider';

describe('in memory data provider', () => {
  let items: Observable<Array<any>>;

  function searchFunction(data: any, searchText: string) {
    return data.column2.indexOf(searchText) > -1;
  }

  beforeEach(() => {
    items = observableOf([
      { id: '1', column1: 101, column2: 'Apple', column3: 'Anne eats apples' },
      { id: '2', column1: 202, column2: 'Banana', column3: 'Ben eats bananas' },
      { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
      {
        id: '4',
        column1: 404,
        column2: 'Grape',
        column3: 'George eats grapes',
      },
      {
        id: '5',
        column1: 505,
        column2: 'Banana',
        column3: 'Becky eats bananas',
      },
      { id: '6', column1: 606, column2: 'Lemon', column3: 'Larry eats lemons' },
      {
        id: '7',
        column1: 707,
        column2: 'Strawberry',
        column3: 'Sally eats strawberries',
      },
    ]);
  });

  it('should handle searching with no results, clearing search, and then having a paging change', fakeAsync(() => {
    const provider = new SkyListInMemoryDataProvider(items);

    let searchObject = {
      searchText: 'z',
      functions: [searchFunction],
    };

    let request = new ListDataRequestModel({
      search: searchObject,
      pageSize: 5,
      pageNumber: 1,
    });

    tick();

    provider
      .get(request)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result.items.length).toBe(0);
        expect(result.count).toBe(0);
      });

    tick();

    searchObject = {
      searchText: '',
      functions: [searchFunction],
    };
    request = new ListDataRequestModel({
      search: searchObject,
      pageSize: 5,
      pageNumber: 1,
    });

    tick();

    provider
      .get(request)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result.items.length).toBe(5);
        expect(result.count).toBe(7);
      });

    tick();

    request = new ListDataRequestModel({
      search: searchObject,
      pageSize: 5,
      pageNumber: 2,
    });

    tick();

    provider
      .get(request)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result.items.length).toBe(2);
        expect(result.count).toBe(7);
      });

    tick();
  }));

  it('should handle more than 10 data entries when paging is undefined', fakeAsync(() => {
    const provider = new SkyListInMemoryDataProvider(
      observableOf([
        {
          id: '1',
          column1: 101,
          column2: 'Apple',
          column3: 'Anne eats apples',
        },
        {
          id: '2',
          column1: 202,
          column2: 'Banana',
          column3: 'Ben eats bananas',
        },
        { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
        {
          id: '4',
          column1: 404,
          column2: 'Grape',
          column3: 'George eats grapes',
        },
        {
          id: '5',
          column1: 505,
          column2: 'Banana',
          column3: 'Becky eats bananas',
        },
        {
          id: '6',
          column1: 606,
          column2: 'Lemon',
          column3: 'Larry eats lemons',
        },
        {
          id: '7',
          column1: 707,
          column2: 'Strawberry',
          column3: 'Sally eats strawberries',
        },
        {
          id: '8',
          column1: 404,
          column2: 'Grape',
          column3: 'George eats grapes',
        },
        {
          id: '9',
          column1: 505,
          column2: 'Banana',
          column3: 'Becky eats bananas',
        },
        {
          id: '10',
          column1: 606,
          column2: 'Lemon',
          column3: 'Larry eats lemons',
        },
        {
          id: '11',
          column1: 707,
          column2: 'Strawberry',
          column3: 'Sally eats strawberries',
        },
      ])
    );
    const request = new ListDataRequestModel({});

    tick();

    provider
      .get(request)
      .pipe(take(1))
      .subscribe((result) => {
        expect(result.items.length).toBe(11);
        expect(result.count).toBe(11);
      });
    tick();
  }));

  describe('sorting', () => {
    it('should handle an ascending sort', fakeAsync(() => {
      const provider = new SkyListInMemoryDataProvider(items);

      const request = new ListDataRequestModel({
        sort: {
          fieldSelectors: [
            {
              fieldSelector: 'column2',
              descending: false,
            },
          ],
        },
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(7);
          expect(result.items[2].data.column2).toEqual('Banana');
        });

      tick();
    }));

    it('should handle a descending sort', fakeAsync(() => {
      const provider = new SkyListInMemoryDataProvider(items);

      const request = new ListDataRequestModel({
        sort: {
          fieldSelectors: [
            {
              fieldSelector: 'column2',
              descending: true,
            },
          ],
        },
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(7);
          expect(result.items[0].data.column2).toEqual('Strawberry');
        });

      tick();
    }));

    it('should handle sorting with null values', fakeAsync(() => {
      items = observableOf([
        { id: '1', column1: 101, column2: null, column3: 'Anne eats apples' },
        {
          id: '2',
          column1: 202,
          column2: 'Banana',
          column3: 'Ben eats bananas',
        },
        { id: '3', column1: 303, column2: 'Pear', column3: 'Patty eats pears' },
        { id: '4', column1: 404, column2: null, column3: 'George eats grapes' },
        {
          id: '5',
          column1: 505,
          column2: 'Banana',
          column3: 'Becky eats bananas',
        },
        {
          id: '6',
          column1: 606,
          column2: 'Lemon',
          column3: 'Larry eats lemons',
        },
        {
          id: '7',
          column1: 707,
          column2: 'Strawberry',
          column3: 'Sally eats strawberries',
        },
      ]);

      const provider = new SkyListInMemoryDataProvider(items);

      const request = new ListDataRequestModel({
        sort: {
          fieldSelectors: [
            {
              fieldSelector: 'column2',
              descending: false,
            },
          ],
        },
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(7);
          expect(result.items[0].data.column2).toEqual('Banana');
        });

      tick();
    }));

    it('should handle sorting with nonstring values', fakeAsync(() => {
      items = observableOf([
        {
          id: '1',
          column1: 101,
          column2: new Date('2/1/2016'),
          column3: 'Anne eats apples',
        },
        {
          id: '2',
          column1: 202,
          column2: new Date('1/1/2016'),
          column3: 'Ben eats bananas',
        },
        {
          id: '3',
          column1: 303,
          column2: new Date('6/1/2016'),
          column3: 'Patty eats pears',
        },
        {
          id: '4',
          column1: 404,
          column2: new Date('7/1/2016'),
          column3: 'George eats grapes',
        },
        {
          id: '5',
          column1: 505,
          column2: new Date('4/1/2016'),
          column3: 'Becky eats bananas',
        },
        {
          id: '6',
          column1: 606,
          column2: new Date('3/1/2016'),
          column3: 'Larry eats lemons',
        },
        {
          id: '7',
          column1: 707,
          column2: new Date('2/1/2016'),
          column3: 'Sally eats strawberries',
        },
      ]);

      const provider = new SkyListInMemoryDataProvider(items);

      const request = new ListDataRequestModel({
        sort: {
          fieldSelectors: [
            {
              fieldSelector: 'column2',
              descending: false,
            },
          ],
        },
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(7);
          expect(result.items[0].id).toEqual('2');
        });

      tick();
    }));
  });

  describe('filtering', () => {
    function filterByColor(item: ListItemModel, filterValue: any): boolean {
      return (
        !filterValue ||
        (filterValue === 'yellow' && item.data.column2 === 'Banana') ||
        (filterValue === 'yellow' && item.data.column2 === 'Lemon')
      );
    }
    it('should handle a simple filter', fakeAsync(() => {
      const provider = new SkyListInMemoryDataProvider(items);

      const request = new ListDataRequestModel({
        filters: [
          new ListFilterModel({
            name: 'fruitColor',
            value: 'yellow',
            filterFunction: filterByColor,
          }),
          new ListFilterModel({
            name: 'blank',
            filterFunction: function (
              item: ListItemModel,
              filterValue: any
            ): boolean {
              return false;
            },
          }),
        ],
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(3);
        });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(3);
        });

      tick();
    }));

    it('should not execute filters when the toolbar is disabled', fakeAsync(() => {
      const provider = new SkyListInMemoryDataProvider(items);
      const request = new ListDataRequestModel({
        isToolbarDisabled: true,
        filters: [
          new ListFilterModel({
            name: 'fruitColor',
            value: 'yellow',
            filterFunction: filterByColor,
          }),
        ],
        pageSize: 5,
        pageNumber: 1,
      });
      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.count).toBe(7);
        });
    }));

    it('should handle both a filter and a search', fakeAsync(() => {
      const provider = new SkyListInMemoryDataProvider(items);

      const searchObject = {
        searchText: 'berry',
        functions: [searchFunction],
      };

      let request = new ListDataRequestModel({
        search: searchObject,
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.items.length).toBe(1);
          expect(result.count).toBe(1);
        });

      tick();

      request = new ListDataRequestModel({
        search: searchObject,
        filters: [
          new ListFilterModel({
            name: 'fruitColor',
            value: 'yellow',
            filterFunction: filterByColor,
          }),
          new ListFilterModel({
            name: 'blank',
            filterFunction: function (
              item: ListItemModel,
              filterValue: any
            ): boolean {
              return false;
            },
          }),
        ],
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      // Searching for "berry" and filtering by "yellow" should return NO results.
      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.items.length).toBe(0);
          expect(result.count).toBe(0);
        });

      tick();

      request = new ListDataRequestModel({
        search: searchObject,
        pageSize: 5,
        pageNumber: 1,
      });

      tick();

      // If filter is removed, original search results should remain.
      provider
        .get(request)
        .pipe(take(1))
        .subscribe((result) => {
          expect(result.items.length).toBe(1);
          expect(result.count).toBe(1);
        });
    }));
  });
});
