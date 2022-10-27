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

  #radioIds: Map<string, string>;
  #radioIds$: BehaviorSubject<string[]>;
  #radioIdsObs: Observable<string[]>;

  constructor() {
    this.#radioIds = new Map();
    this.#radioIds$ = new BehaviorSubject<string[]>([]);
    this.#radioIdsObs = this.#radioIds$.asObservable();
  }

  /**
   * Associates a radio input's ID with its parent radio group.
   * @param {string} id A unique ID for the radio component.
   * @param {string} inputElementId The ID applied to the radio input element.
   */
  public register(id: string, inputElementId: string): void {
    if (!this.#radioIds.has(id) || this.#radioIds.get(id) !== inputElementId) {
      this.#radioIds.set(id, inputElementId);
      this.#emitRadioIds();
    }
  }

  /**
   * Disassociates a radio input's ID with its parent radio group.
   * @param {string} id The ID used to register the radio component.
   */
  public unregister(id: string): void {
    if (this.#radioIds.has(id)) {
      this.#radioIds.delete(id);
      this.#emitRadioIds();
    }
  }

  #emitRadioIds(): void {
    this.#radioIds$.next(Array.from(this.#radioIds.values()));
  }
}
