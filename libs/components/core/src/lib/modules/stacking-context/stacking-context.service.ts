import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject, Observable, isObservable } from 'rxjs';

import {
  SkyStackingContext,
  SkyStackingContextInterface,
} from './stacking-context';

@Injectable()
export class SkyStackingContextService {
  readonly #zIndex: Observable<number>;

  constructor(
    @Inject(SkyStackingContext) context: SkyStackingContextInterface
  ) {
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
