import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

interface RegisterArgs {
  /**
   * A unique ID for the radio component.
   */
  id: string;
  /**
   * The ID applied to the radio input element.
   */
  inputElementId: string;
}

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
   */
  public register(args: RegisterArgs): void {
    if (
      !this.#radioIds.has(args.id) ||
      this.#radioIds.get(args.id) !== args.inputElementId
    ) {
      this.#radioIds.set(args.id, args.inputElementId);
      this.#emitRadioIds();
    }
  }

  /**
   * Disassociates a radio input's ID with its parent radio group.
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
