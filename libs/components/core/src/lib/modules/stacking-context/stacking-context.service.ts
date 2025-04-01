import { DestroyRef, Injectable } from '@angular/core';

import { Stratum } from './stratum-names';

@Injectable({
  providedIn: 'root',
})
export class SkyStackingContextService {
  public static readonly MODAL_BACKDROP_Z_INDEX = 8e7 - 1e2;

  readonly #baseZIndex: Record<Stratum, number> = {
    base: 1e6,
    flyout: 2e7,
    omnibar: 4e7,
    help: 6e7,
    modal: 8e7,
    toast: 10e7,
    'page-wait': 12e7,
  };
  readonly #assignedZIndexes: Record<Stratum, Set<number>> = {
    base: new Set(),
    flyout: new Set(),
    omnibar: new Set(),
    help: new Set(),
    modal: new Set(),
    toast: new Set(),
    'page-wait': new Set(),
  };
  readonly #increment = 1e3;

  public getZIndex(stratum: Stratum, destroyRef?: DestroyRef): number {
    let zIndex = this.#baseZIndex[stratum];
    if (this.#assignedZIndexes[stratum].size > 0) {
      zIndex =
        Math.max(...Array.from(this.#assignedZIndexes[stratum].values())) +
        this.#increment;
    }
    this.#assignedZIndexes[stratum].add(zIndex);
    destroyRef?.onDestroy(() => {
      this.unsetZIndex(zIndex);
    });
    return zIndex;
  }

  public unsetZIndex(zIndex: number): void {
    Object.values(this.#assignedZIndexes).forEach((zIndices) => {
      zIndices.delete(zIndex);
    });
  }
}
