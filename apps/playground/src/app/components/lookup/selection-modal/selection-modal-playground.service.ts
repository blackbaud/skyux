import { Injectable } from '@angular/core';
import { SkySelectionModalSearchArgs } from '@skyux/lookup';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SelectionModalPlaygroundPerson } from './types/selection-modal-playground-person';
import { SelectionModalPlaygroundSearchResults } from './types/selection-modal-playground-search-results';

const people: SelectionModalPlaygroundPerson[] = [
  { id: '1', name: 'Abed' },
  { id: '2', name: 'Alex' },
  { id: '3', name: 'Amber' },
  { id: '4', name: 'Andre' },
  { id: '5', name: 'Annie' },
  { id: '6', name: 'Ben' },
  { id: '7', name: 'Britta' },
  { id: '8', name: 'Buzz' },
  { id: '9', name: 'Cory' },
  { id: '10', name: 'Craig' },
  { id: '11', name: 'Elroy' },
  { id: '12', name: 'Garrett' },
  { id: '13', name: 'Gilbert' },
  { id: '14', name: 'Ian' },
  { id: '15', name: 'Jeff' },
  { id: '16', name: 'Joshua' },
  { id: '17', name: 'Koogler' },
  { id: '18', name: 'Leonard' },
  { id: '19', name: 'Marshall' },
  { id: '20', name: 'Michelle' },
  { id: '21', name: 'Neil' },
  { id: '22', name: 'Pierce' },
  { id: '23', name: 'Preston' },
  { id: '24', name: 'Rachel' },
  { id: '25', name: 'Robert' },
  { id: '26', name: 'Robin' },
  { id: '27', name: 'Sean' },
  { id: '28', name: 'Shirley' },
  { id: '29', name: 'Todd' },
  { id: '30', name: 'Troy' },
  { id: '31', name: 'Vaughn' },
  { id: '32', name: 'Vicki' },
];

@Injectable({
  providedIn: 'root',
})
export class SelectionModalPlaygroundService {
  public addItem(item: SelectionModalPlaygroundPerson): void {
    people.push(item);
  }

  public search(
    args: SkySelectionModalSearchArgs,
  ): Observable<SelectionModalPlaygroundSearchResults> {
    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    const size = 15;
    const searchText = args.searchText.toUpperCase();
    const slice = !searchText
      ? args.offset
      : args.continuationData
        ? people.indexOf(
            people.find((person) => person.id === args.continuationData),
          )
        : 0;

    const matchingPeople = people.filter((person) =>
      person.name.toUpperCase().includes(searchText),
    );

    const total =
      slice + size < matchingPeople.length ? slice + size : undefined;
    const retVal = matchingPeople.slice(slice, total);

    const continuationData = searchText
      ? retVal[retVal.length - 1]?.id
      : undefined;

    return of({
      hasMore: !!total,
      continuationData: continuationData,
      people: retVal,
      totalCount: matchingPeople.length,
    }).pipe(delay(800));
  }
}
