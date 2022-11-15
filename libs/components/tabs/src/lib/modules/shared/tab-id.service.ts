import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tracks the element IDs for all tabs within a tablist.
 * @internal
 */
@Injectable()
export class SkyTabIdService {
  public get ids(): Observable<string[]> {
    return this.#idsObs;
  }

  #ids: Map<string, string>;
  #ids$: BehaviorSubject<string[]>;
  #idsObs: Observable<string[]>;

  constructor() {
    this.#ids = new Map();
    this.#ids$ = new BehaviorSubject<string[]>([]);
    this.#idsObs = this.#ids$.asObservable();
  }

  /**
   * Associates a tab's ID with its parent tablist.
   * @param {string} id A unique ID for the tab's registration.
   * @param {string} elementId The ID applied to the tab's element.
   */
  public register(id: string, elementId: string): void {
    if (!this.#ids.has(id) || this.#ids.get(id) !== elementId) {
      this.#ids.set(id, elementId);
      this.#emitIds();
    }
  }

  /**
   * Disassociates a tab's ID with its parent tablist.
   * @param {string} id The ID used to register the tab.
   */
  public unregister(id: string): void {
    if (this.#ids.has(id)) {
      this.#ids.delete(id);
      this.#emitIds();
    }
  }

  #emitIds(): void {
    this.#ids$.next(Array.from(this.#ids.values()));
  }
}
