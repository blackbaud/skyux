import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tracks the element IDs for all radios within a radio group.
 * @internal
 */
@Injectable()
export class SkyRadioGroupIdService {
  public get radioIds(): Observable<string[]> {
    return this.#radioIdsObs;
  }

  #radioIds: string[] = [];
  #radioIds$: BehaviorSubject<string[]>;
  #radioIdsObs: Observable<string[]>;

  constructor() {
    this.#radioIds$ = new BehaviorSubject<string[]>([]);
    this.#radioIdsObs = this.#radioIds$.asObservable();
  }

  /**
   * Associates a radio input's ID with its parent radio group.
   */
  public registerId(id: string): void {
    if (this.#radioIds.indexOf(id) === -1) {
      this.#radioIds.push(id);
      this.#emitRadioIds();
    }
  }

  /**
   * Updates a radio input's ID with its parent radio group.
   */
  public updateId(oldId: string, newId: string): void {
    const index = this.#radioIds.indexOf(oldId);
    if (index > -1) {
      this.#radioIds[index] = newId;
      this.#emitRadioIds();
    }
  }

  /**
   * Disassociates a radio input's ID with its parent radio group.
   */
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
