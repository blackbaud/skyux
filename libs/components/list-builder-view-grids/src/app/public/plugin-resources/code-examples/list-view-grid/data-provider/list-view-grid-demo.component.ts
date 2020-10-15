import {
  Component,
  Injectable
} from '@angular/core';

import {
  ListItemModel
} from '@skyux/list-builder-common';

import {
  ListDataProvider,
  ListDataRequestModel,
  ListDataResponseModel
} from '@skyux/list-builder';

import {
  BehaviorSubject,
  Observable,
  of
} from 'rxjs';

import {
  map
} from 'rxjs/operators';

@Injectable()
export class DemoListProvider extends ListDataProvider {

  public items: Observable<ListItemModel[]>;

  public remoteCount: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() {
    super();
    this.items = of([
      {
        id: '0',
        data: {
          name: 'Orange',
          description: 'A round, orange fruit.',
          type: 'citrus',
          color: 'orange',
          highAcidity: 'True',
          ph: 3.71
        }
      },
      {
        id: '1',
        data: {
          name: 'Mango',
          description: 'Delicious in smoothies, but don\'t eat the skin.',
          type: 'other',
          color: 'orange',
          highAcidity: 'False',
          ph: 5.92
        }
      },
      {
        id: '2',
        data: {
          name: 'Lime',
          description: 'A sour, green fruit used in many drinks.',
          type: 'citrus',
          color: 'green',
          highAcidity: 'True',
          ph: 2.50
        }
      },
      {
        id: '3',
        data: {
          name: 'Strawberry',
          description: 'A red fruit that goes well with shortcake.',
          type: 'berry',
          color: 'red',
          highAcidity: 'True',
          ph: 3.84
        }
      },
      {
        id: '4',
        data: {
          name: 'Blueberry',
          description: 'A small, blue fruit often found in muffins.',
          type: 'berry',
          color: 'blue',
          highAcidity: 'True',
          ph: 3.21
        }
      },
      {
        id: '5',
        data: {
          name: 'Black Olives',
          description: 'A small fruit used on pizza.',
          type: 'other',
          color: 'black',
          highAcidity: 'False',
          ph: 6.14
        }
      }
    ]);
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    /*
      In get() you get data based on a given ListDataRequestModel.
      You can fetch data remotely here and return an Observable<ListDataResponseModel>.
    */
    return this.fakeHttpRequest(request);
  }

  public count(): Observable<number> {
    return this.remoteCount;
  }

  private fakeHttpRequest(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.items.pipe(map((items: ListItemModel[]) => {
      let modifiedList = items;

      if (request.search.searchText) {
        let searchText = request.search.searchText.toLowerCase();

        modifiedList = modifiedList.filter((item) => {
          return (
            item.data.name.toLowerCase().indexOf(searchText) > -1 ||
            item.data.description.toLowerCase().indexOf(searchText) > -1
          );
        });
      }

      if (request.filters) {
        for (let filter of request.filters) {
          if (filter.name === 'fruitType' && filter.value !== 'any') {
            modifiedList = modifiedList.filter((item) => {
              return item.data.type === request.filters[0].value;
            });
          } else if (filter.name === 'hideOrange' && filter.value) {
            modifiedList = modifiedList.filter(filter.filterFunction);
          }
        }
      }

      if (request.sort) {
        for (let fieldSelector of request.sort.fieldSelectors) {
          if (fieldSelector.fieldSelector === 'highAcidity') {
            modifiedList = modifiedList.sort((itemA: any, itemB: any) => {
              if (fieldSelector.descending) {
                return itemA.data.ph < itemB.data.ph ? 1 : -1;
              } else {
                return itemA.data.ph < itemB.data.ph ? -1 : 1;
              }
            });
          }
        }
      }

      let itemStart = (request.pageNumber - 1) * request.pageSize;
      let pagedResult = modifiedList.slice(itemStart, itemStart + request.pageSize);

      this.remoteCount.next(modifiedList.length);

      return new ListDataResponseModel({
        count: modifiedList.length,
        items: pagedResult
      });
    }));
  }
}

@Component({
  selector: 'app-list-view-grid-demo',
  templateUrl: './list-view-grid-demo.component.html',
  providers: [DemoListProvider]
})
export class ListViewGridDemoComponent {

  constructor(
    public listDataProvider: DemoListProvider
  ) { }

  public hideOrangeFilterFunction(item: ListItemModel, filterValue: any): boolean {
    return !filterValue || (filterValue && item.data.color !== 'orange');
  }

}
