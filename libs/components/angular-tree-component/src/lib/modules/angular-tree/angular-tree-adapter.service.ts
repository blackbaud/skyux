import { Injectable } from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyAngularTreeAdapterService {
  constructor(private skyAdapterService: SkyCoreAdapterService) {}

  public getFocusableChildren(element: HTMLElement): HTMLElement[] {
    return this.skyAdapterService.getFocusableChildren(element);
  }

  public setTabIndexOfFocusableElems(
    element: HTMLElement,
    tabIndex: number
  ): void {
    const focusableElems = this.skyAdapterService.getFocusableChildren(element);
    let index = focusableElems.length;
    while (index--) {
      focusableElems[index].tabIndex = tabIndex;
    }
  }
}
