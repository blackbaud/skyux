import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tracks the element IDs for all radios within a radio group.
 * @internal
 */
@Injectable()
export class SkyRadioGroupIdService {
  public radioIds$: Observable<string[]>;

  #radioIds: string[] = [];
  #radioIds$: BehaviorSubject<string[]>;

  constructor() {
    this.#radioIds$ = new BehaviorSubject<string[]>([]);
    this.radioIds$ = this.#radioIds$.asObservable();
  }

  public registerId(id: string): void {
    if (this.#radioIds.indexOf(id) === -1) {
      this.#radioIds.push(id);
      this.#emitRadioIds();
    }
  }

  public updateId(oldId: string, newId: string): void {
    this.unregisterId(oldId);
    this.registerId(newId);
  }

  public unregisterId(id: string): void {
    const index = this.#radioIds.indexOf(id);
    if (index > -1) {
      this.#radioIds.splice(index);
      this.#emitRadioIds();
    }
  }

  #emitRadioIds(): void {
    this.#radioIds$.next(this.#radioIds);
  }
}
