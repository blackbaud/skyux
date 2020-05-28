import {
  Injectable
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '@skyux/core';

@Injectable()
export class SkyAgGridAdapterService {
  constructor(
    private skyAdapterService: SkyCoreAdapterService
  ) { }

  public elementOrParentHasClass(element: HTMLElement, className: string): boolean {
    if (element.classList.contains(className)) {
      return true;
    } else if (element.parentElement) {
      return this.elementOrParentHasClass(element.parentElement, className);
    }
    return false;
  }

  public setFocusedElementById(parentEl: HTMLElement, selector: string): void {
    const element = parentEl.querySelector(`#${selector}`) as HTMLElement;

    /* istanbul ignore else */
    if (element) {
      element.focus();
    }
  }

  public getFocusedElement(): HTMLElement {
    return document.activeElement as HTMLElement;
  }

  public focusOnFocusableChildren(element: HTMLElement): void {
    let focusableChildren = this.skyAdapterService.getFocusableChildren(element);

    if (focusableChildren.length) {
      focusableChildren[0].focus();
    }
  }
}
