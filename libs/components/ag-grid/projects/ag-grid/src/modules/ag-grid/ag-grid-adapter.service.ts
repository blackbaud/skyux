import {
  Injectable
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '@skyux/core';

@Injectable({
  providedIn: 'root'
})
export class SkyAgGridAdapterService {
  constructor(
    private skyAdapterService: SkyCoreAdapterService
  ) { }

  public getElementOrParentWithClass(element: HTMLElement, className: string): HTMLElement | undefined {
    if (element && element.classList.contains(className)) {
      return element;
    } else if (element.parentElement) {
      return this.getElementOrParentWithClass(element.parentElement, className);
    }
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

  public getNextFocusableElement(currentEl: HTMLElement, parentEl: HTMLElement, moveFocusLeft?: boolean): HTMLElement | undefined {
    if (parentEl) {
      const focusableChildren = this.skyAdapterService.getFocusableChildren(parentEl);
      const currentElementIndex = focusableChildren.indexOf(currentEl);
      const nextIndex = moveFocusLeft ? currentElementIndex - 1 : currentElementIndex + 1;

      if ((!moveFocusLeft && focusableChildren.length >= nextIndex) || (moveFocusLeft && nextIndex >= 0)) {
        return focusableChildren[nextIndex];
      }
    }
  }

  public focusOnFocusableChildren(element: HTMLElement): void {
    let focusableChildren = this.skyAdapterService.getFocusableChildren(element);

    if (focusableChildren.length) {
      focusableChildren[0].focus();
    }
  }
}
