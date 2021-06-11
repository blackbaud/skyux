import {
  ElementRef,
  Injectable
} from '@angular/core';

/**
 * @internal
 */
 @Injectable()
 export class SkyInputBoxAdapterService {

  public focusControl(elRef: ElementRef): void {
    const control = elRef.nativeElement.querySelector('.sky-form-control');
    if (control) {
      control.focus();
    }
  }

  /**
   * Returns the inline help element.
   */
  public getInlineHelpElement(elRef: ElementRef): HTMLElement {
    return elRef.nativeElement.querySelector('.sky-control-help');
  }

  /**
   * Returns true if the provided element contains the focused element.
   */
  public isFocusInElement(el: HTMLElement): boolean {
    if (el) {
      return el === document.activeElement || el.contains(document.activeElement);
    }
    return false;
  }

 }
