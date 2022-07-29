import { Injectable } from '@angular/core';

let idIndex = 0;

@Injectable({
  providedIn: 'root',
})
export class SkyIdService {
  public generateId(): string {
    idIndex++;

    // Include timestamp and an incrementing index to guarantee unique IDs both during the application
    // lifecycle as well as across sessions, since browsers will try to apply autocomplete options to
    // elements with the same ID across sessions.
    return `sky-id-gen__${new Date().getTime()}__${idIndex}`;
  }
}
