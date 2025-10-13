import { Injectable } from '@angular/core';
import { SkyFilterItemLookupSearchAsyncResult } from '@skyux/filter-bar';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface FruitTypeLookupItem {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  fruitTypes: FruitTypeLookupItem[] = [
    { id: 'citrus', name: 'Citrus' },
    { id: 'berry', name: 'Berry' },
  ];

  public search(
    searchText: string,
  ): Observable<SkyFilterItemLookupSearchAsyncResult> {
    searchText = searchText.toUpperCase();

    const matchingTypes = this.fruitTypes.filter((fruit) =>
      fruit.name?.toUpperCase().includes(searchText),
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
