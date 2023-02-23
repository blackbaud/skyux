import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, isObservable } from 'rxjs';

@Injectable()
export class SkyStackingContextService {
  readonly #zIndex: Observable<number>;

  constructor(context: { zIndex: number | Observable<number> }) {
    this.#zIndex = isObservable(context.zIndex)
      ? context.zIndex
      : new BehaviorSubject(context.zIndex).asObservable();
  }

  /**
   * Get the z-index of this stacking context.
   */
  public getZIndex(): Observable<number> {
    return this.#zIndex;
  }
}
