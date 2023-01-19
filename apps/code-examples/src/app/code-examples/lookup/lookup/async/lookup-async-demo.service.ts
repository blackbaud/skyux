import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LookupAsyncDemoSearchResults } from './lookup-async-demo-search-results';
import { LookupDemoPerson } from './lookup-demo-person';

/* spell-checker:disable */
const people: LookupDemoPerson[] = [
  { name: 'Abed' },
  { name: 'Alex' },
  { name: 'Ben' },
  { name: 'Britta' },
  { name: 'Buzz' },
  { name: 'Craig' },
  { name: 'Elroy' },
  { name: 'Garrett' },
  { name: 'Ian' },
  { name: 'Jeff' },
  { name: 'Leonard' },
  { name: 'Neil' },
  { name: 'Pierce' },
  { name: 'Preston' },
  { name: 'Rachel' },
  { name: 'Shirley' },
  { name: 'Todd' },
  { name: 'Troy' },
  { name: 'Vaughn' },
  { name: 'Vicki' },
];
/* spell-checker:disable */

@Injectable({
  providedIn: 'root',
})
export class LookupAsyncDemoService {
  public search(searchText: string): Observable<LookupAsyncDemoSearchResults> {
    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    searchText = searchText.toUpperCase();

    const matchingPeople = people.filter((person) =>
      person.name.toUpperCase().includes(searchText)
    );

    return of({
      hasMore: false,
      people: matchingPeople,
      totalCount: matchingPeople.length,
    }).pipe(delay(800));
  }

  public addPerson(person: LookupDemoPerson): Observable<number> {
    // Simulate adding a person with a network call.
    if (!people.some((item) => item.name === person.name)) {
      people.unshift(person);
    }

    return of(1).pipe(delay(800));
  }
}
