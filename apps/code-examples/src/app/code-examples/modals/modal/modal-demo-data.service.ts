import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { ModalDemoData } from './modal-demo-data';

@Injectable({
  providedIn: 'root',
})
export class ModalDemoDataService {
  #data: ModalDemoData = {
    value1: 'Hello world',
  };

  public load(): Observable<ModalDemoData> {
    // Simulate a network request to get data.
    return of(this.#data).pipe(delay(1000));
  }

  public save(data: ModalDemoData): Observable<ModalDemoData> {
    this.#data = data;

    // Simulate a network request to save data.
    return of(this.#data).pipe(delay(1000));
  }
}
