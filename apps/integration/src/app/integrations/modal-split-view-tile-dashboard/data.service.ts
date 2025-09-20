import { Injectable, InjectionToken, inject } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ModalDemoData } from './data';

/* istanbul ignore next */
export const ModalDemoDataServiceDelay = new InjectionToken(
  'ModalDemoDataServiceDelay',
  {
    factory: (): number => 100,
    providedIn: 'root',
  },
);

@Injectable({
  providedIn: 'root',
})
export class ModalDemoDataService {
  #data: ModalDemoData = {
    value1: 'Hello world',
  };
  #delay = inject(ModalDemoDataServiceDelay);

  public load(): Observable<ModalDemoData> {
    // Simulate a network request to get data.
    return of(this.#data).pipe(delay(this.#delay));
  }
}
