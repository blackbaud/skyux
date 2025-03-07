import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Person } from './person';
import { SearchResults } from './search-results';

const people: Person[] = [
  { id: '1', name: 'Abed' },
  { id: '2', name: 'Alex' },
  { id: '3', name: 'Ben' },
  { id: '4', name: 'Britta' },
  { id: '5', name: 'Buzz' },
  { id: '6', name: 'Craig' },
  { id: '7', name: 'Elroy' },
  { id: '8', name: 'Garrett' },
  { id: '9', name: 'Ian' },
  { id: '10', name: 'Jeff' },
  { id: '11', name: 'Leonard' },
  { id: '12', name: 'Neil' },
  { id: '13', name: 'Pierce' },
  { id: '14', name: 'Preston' },
  { id: '15', name: 'Rachel' },
  { id: '16', name: 'Shirley' },
  { id: '17', name: 'Todd' },
  { id: '18', name: 'Troy' },
  { id: '19', name: 'Vaughn' },
  { id: '20', name: 'Vicki' },
];

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  public search(searchText: string): Observable<SearchResults> {
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
}
