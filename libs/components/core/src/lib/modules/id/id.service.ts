import { Injectable } from '@angular/core';

let idIndex = 0;

/**
 * Generates unique IDs to be used with HTML elements.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyIdService {
  public generateId(): string {
    idIndex++;

    return `sky-id-gen__${new Date().getTime()}__${idIndex}`;
  }
}
