import { Injectable } from '@angular/core';

import { Observable, delay, of } from 'rxjs';

import { DemoData } from './demo-data';

const people = [
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
export class DemoDataService {
  public getPagedData(
    pageNumber: number,
    itemCount: number,
  ): Observable<DemoData> {
    const startIndex = (pageNumber - 1) * itemCount;

    return of({
      people: people.slice(startIndex, startIndex + itemCount),
      totalCount: people.length,
    }).pipe(
      // Simulate network latency.
      delay(1000),
    );
  }
}
