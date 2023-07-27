import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { LookupAsyncDemoSearchResults } from './lookup-async-demo-search-results';
import { LookupDemoPerson } from './lookup-demo-person';

const people: LookupDemoPerson[] = [
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

  public addPerson(person: LookupDemoPerson): Observable<LookupDemoPerson[]> {
    // Simulate adding a person with a network call.
    if (!people.some((item) => item.name === person.name)) {
      people.unshift(person);
    }

    return of(people.slice()).pipe(delay(800));
  }
}
