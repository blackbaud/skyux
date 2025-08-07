import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Person } from './person';
import { LookupAsyncDemoSearchResults } from './search-results';

const people: Person[] = [
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

@Injectable({
  providedIn: 'root',
})
export class DemoService {
  public search(searchText: string): Observable<LookupAsyncDemoSearchResults> {
    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    searchText = searchText.toUpperCase();

    const matchingPeople = people.filter((person) =>
      person.name.toUpperCase().includes(searchText),
    );

    return of({
      hasMore: false,
      people: matchingPeople,
      totalCount: matchingPeople.length,
    }).pipe(delay(800));
  }

  public addPerson(person: Person): Observable<number> {
    // Simulate adding a person with a network call.
    if (!people.some((item) => item.name === person.name)) {
      people.unshift(person);
    }

    return of(1).pipe(delay(800));
  }
}
