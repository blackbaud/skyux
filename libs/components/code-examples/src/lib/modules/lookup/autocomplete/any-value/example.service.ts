import { Injectable } from '@angular/core';

import { Observable, delay, of } from 'rxjs';

import { ColorOption } from './color-option';
import { SearchResults } from './search-results';

const colors: ColorOption[] = [
  { id: 1, name: 'Red' },
  { id: 2, name: 'Blue' },
  { id: 3, name: 'Green' },
];

@Injectable({
  providedIn: 'root',
})
export class LookupAutocompleteAnyValueExampleService {
  public search(searchText: string): Observable<SearchResults> {
    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    searchText = searchText.toUpperCase();

    const matchingColors = colors.filter((color) =>
      color.name.toUpperCase().includes(searchText),
    );

    return of({
      hasMore: false,
      colors: matchingColors,
      totalCount: matchingColors.length,
    }).pipe(delay(800));
  }
}
