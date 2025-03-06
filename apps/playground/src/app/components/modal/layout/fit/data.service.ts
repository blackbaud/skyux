import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { SplitViewModalDemoData } from './data';

@Injectable({
  providedIn: 'root',
})
export class ModalDemoDataService {
  #data: SplitViewModalDemoData = {
    value1: 'Hello world',
  };

  public load(): Observable<SplitViewModalDemoData> {
    // Simulate a network request to get data.
    return of(this.#data).pipe(delay(100));
  }

  public save(
    data: SplitViewModalDemoData,
  ): Observable<SplitViewModalDemoData> {
    this.#data = data;

    // Simulate a network request to save data.
    return of(this.#data).pipe(delay(1000));
  }
}
