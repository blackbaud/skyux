import { Injectable } from '@angular/core';
import { SkyFilterItemLookupSearchAsyncResult } from '@skyux/filter-bar';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { FruitTypeLookupItem } from './fruit-type-lookup-item';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  readonly #fruitTypes: FruitTypeLookupItem[] = [
    { id: 'citrus', name: 'Citrus' },
    { id: 'berry', name: 'Berry' },
  ];

  public search(
    searchText: string,
  ): Observable<SkyFilterItemLookupSearchAsyncResult> {
    searchText = searchText.toLocaleUpperCase();

    const matchingTypes = this.#fruitTypes.filter((fruit) =>
      fruit.name?.toLocaleUpperCase().includes(searchText),
    );

    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    return of({
      hasMore: false,
      items: matchingTypes,
      totalCount: matchingTypes.length,
    }).pipe(delay(800));
  }
}
