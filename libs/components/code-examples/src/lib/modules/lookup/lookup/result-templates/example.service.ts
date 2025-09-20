import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Person } from './person';
import { LookupAsyncDemoSearchResults } from './search-results';

const people: Person[] = [
  {
    name: 'Abed',
    formal: 'Mr. Nadir',
  },
  {
    name: 'Alex',
    formal: 'Mr. Osbourne',
  },
  {
    name: 'Ben',
    formal: 'Mr. Chang',
  },
  {
    name: 'Britta',
    formal: 'Ms. Perry',
  },
  {
    name: 'Buzz',
    formal: 'Mr. Hickey',
  },
  {
    name: 'Craig',
    formal: 'Mr. Pelton',
  },
  {
    name: 'Elroy',
    formal: 'Mr. Patashnik',
  },
  {
    name: 'Garrett',
    formal: 'Mr. Lambert',
  },
  {
    name: 'Ian',
    formal: 'Mr. Duncan',
  },
  {
    name: 'Jeff',
    formal: 'Mr. Winger',
  },
  {
    name: 'Leonard',
    formal: 'Mr. Rodriguez',
  },
  {
    name: 'Neil',
    formal: 'Mr. Neil',
  },
  {
    name: 'Pierce',
    formal: 'Mr. Hawthorne',
  },
  {
    name: 'Preston',
    formal: 'Mr. Koogler',
  },
  {
    name: 'Rachel',
    formal: 'Ms. Rachel',
  },
  {
    name: 'Shirley',
    formal: 'Ms. Bennett',
  },
  {
    name: 'Todd',
    formal: 'Mr. Jacobson',
  },
  {
    name: 'Troy',
    formal: 'Mr. Barnes',
  },
  {
    name: 'Vaughn',
    formal: 'Mr. Miller',
  },
  {
    name: 'Vicki',
    formal: 'Ms. Jenkins',
  },
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
