import { Injectable } from '@angular/core';
import {
  SkyFilterBarFilterValue,
  SkyFilterItemLookupSearchAsyncResult,
} from '@skyux/filter-bar';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/* cspell: disable */
const people: SkyFilterBarFilterValue[] = [
  { value: '1', displayValue: 'Solomon Hurley' },
  { value: '2', displayValue: 'Kanesha Hutto' },
  { value: '3', displayValue: 'Darcel Lenz' },
  { value: '4', displayValue: 'Cheyenne Lightfoot' },
  { value: '5', displayValue: 'Jack Lovett' },
  { value: '6', displayValue: 'Wonda Lumpkin' },
  { value: '7', displayValue: 'Kristeen Lunsford' },
  { value: '8', displayValue: 'Clarice Overton' },
  { value: '9', displayValue: 'Martine Rocha' },
  { value: '10', displayValue: 'Tonja Sanderson' },
  { value: '11', displayValue: 'Molly Seymour' },
  { value: '12', displayValue: 'Ed Sipes' },
  { value: '13', displayValue: 'Cristen Sizemore' },
  { value: '14', displayValue: 'Rod Tomlinson' },
  { value: '15', displayValue: 'Eliza Vanhorn' },
  { value: '16', displayValue: 'Jessy Witherspoon' },
  { value: '17', displayValue: 'Ilene Woo' },
];
/* cspell: enable */

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  public search(
    searchText: string,
  ): Observable<SkyFilterItemLookupSearchAsyncResult> {
    searchText = searchText.toUpperCase();

    const matchingPeople = people.filter((person) =>
      person.displayValue?.toUpperCase().includes(searchText),
    );

    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    return of({
      hasMore: false,
      items: matchingPeople,
      totalCount: matchingPeople.length,
    }).pipe(delay(800));
  }
}
