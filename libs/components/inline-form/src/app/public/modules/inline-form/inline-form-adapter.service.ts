import {
  ElementRef,
  Injectable
} from '@angular/core';

/* tslint:disable */
const SKY_TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([tabindex=\'-1\'])',
  'button:not([disabled]):not([tabindex=\'-1\'])',
  'select:not([disabled]):not([tabindex=\'-1\'])',
  'textarea:not([disabled]):not([tabindex=\'-1\'])',
  'iframe',
  'object',
  'embed',
  '*[tabindex]:not([tabindex=\'-1\'])',
  '*[contenteditable=true]'
].join(', ');
/* tslint:enable */

/**
 * @internal
 */
@Injectable()
export class SkyInlineFormAdapterService {

  public applyAutofocus(inlineFormElementRef: ElementRef): void {
    const inputWithAutofocus = inlineFormElementRef.nativeElement.querySelector('[autofocus]');

    if (inputWithAutofocus) {
      inputWithAutofocus.focus();
    } else {
      let focusEl: HTMLElement = inlineFormElementRef.nativeElement.querySelector('.sky-inline-form-content');
      let focusableChildren = this.loadFocusableChildren(focusEl);

      this.focusFirstElement(focusableChildren);
    }
  }

  private loadFocusableChildren(elem: HTMLElement): HTMLElement[] {
    const elements: Array<HTMLElement>
      = Array.prototype.slice.call(elem.querySelectorAll(SKY_TABBABLE_SELECTOR));

    return elements.filter((element) => {
      return this.isVisible(element);
    });
  }

  private isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const isHidden = style.display === 'none' || style.visibility === 'hidden';
    if (isHidden) {
      return false;
    }

    const hasBounds = !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
    return hasBounds;
  }

  private focusFirstElement(list: Array<HTMLElement>): void {
    if (list.length > 0) {
      list[0].focus();
    }
  }
}
