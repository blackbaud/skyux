import { Injectable } from '@angular/core';
import { SkyFilterItemLookupSearchAsyncResult } from '@skyux/filter-bar';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { JOB_TITLES } from './data';

@Injectable({
  providedIn: 'root',
})
export class ExampleService {
  #jobs = Object.values(JOB_TITLES).flat();

  public search(
    searchText: string,
  ): Observable<SkyFilterItemLookupSearchAsyncResult> {
    searchText = searchText.toUpperCase();

    const matchingJobs = this.#jobs.filter((job) =>
      job.name?.toUpperCase().includes(searchText),
    );

    // Simulate a network call with latency. A real-world application might
    // use Angular's HttpClient to create an Observable from a call to a
    // web service.
    return of({
      hasMore: false,
      items: matchingJobs,
      totalCount: matchingJobs.length,
    }).pipe(delay(800));
  }
}
