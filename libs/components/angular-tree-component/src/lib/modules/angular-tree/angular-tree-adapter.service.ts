import { Injectable } from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyAngularTreeAdapterService {
  #coreAdapterService: SkyCoreAdapterService;

  constructor(coreAdapterService: SkyCoreAdapterService) {
    this.#coreAdapterService = coreAdapterService;
  }

  public getFocusableChildren(element: HTMLElement): HTMLElement[] {
    return this.#coreAdapterService.getFocusableChildren(element);
  }

  public setTabIndexOfFocusableElems(
    element: HTMLElement,
    tabIndex: number
  ): void {
    const focusableElems =
      this.#coreAdapterService.getFocusableChildren(element);
    let index = focusableElems.length;
    while (index--) {
      focusableElems[index].tabIndex = tabIndex;
    }
  }
}
