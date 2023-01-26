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

  public setTabIndexOfFocusableEls(
    element: HTMLElement,
    tabIndex: number
  ): void {
    const focusableEls = this.#coreAdapterService.getFocusableChildren(element);
    let index = focusableEls.length;
    while (index--) {
      focusableEls[index].tabIndex = tabIndex;
    }
  }
}
