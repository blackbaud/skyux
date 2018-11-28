import {
  Injectable,
  ElementRef
} from '@angular/core';
/* tslint:disable */
let tabbableSelector = 'a[href], area[href], input:not([disabled]):not([tabindex=\'-1\']), ' +
        'button:not([disabled]):not([tabindex=\'-1\']),select:not([disabled]):not([tabindex=\'-1\']), textarea:not([disabled]):not([tabindex=\'-1\']), ' +
        'iframe, object, embed, *[tabindex]:not([tabindex=\'-1\']), *[contenteditable=true]';
/* tslint:enable */

@Injectable()
export class SkyModalComponentAdapterService {
  constructor(
  ) { }

  public handleWindowChange(modalEl: ElementRef): void {
    let boundedHeightEl = modalEl.nativeElement.querySelector('.sky-modal');
    let fullPageModalEl = modalEl.nativeElement.querySelector('.sky-modal-full-page');
    /*
      Set modal height equal to max height of window (accounting for padding above and below modal)
    */
    let newHeight = window.innerHeight - 40;

    boundedHeightEl.style.maxHeight = newHeight.toString() + 'px';
    if (fullPageModalEl) {
      fullPageModalEl.style.height = window.innerHeight.toString() + 'px';
      fullPageModalEl.style.maxHeight = window.innerHeight.toString() + 'px';
    } else {
      /*
        IE11 doesn't handle flex and max-height correctly so we have to explicitly add
        max-height to the content that accounts for standard header and footer height.
      */
      let modalContentEl = modalEl.nativeElement.querySelector('.sky-modal-content');
      let contentHeight = newHeight - 114;
      modalContentEl.style.maxHeight = contentHeight.toString() + 'px';

    }
  }

  public loadFocusElementList(modalEl: ElementRef): Array<HTMLElement> {
    return this.loadFocusableChildren(modalEl.nativeElement);
  }

  public isFocusInFirstItem(event: KeyboardEvent, list: Array<HTMLElement>): boolean {
    /* istanbul ignore next */
    /* sanity check */
    let eventTarget = event.target || event.srcElement;
    return list.length > 0 && eventTarget === list[0];
  }

  public isFocusInLastItem(event: KeyboardEvent, list: Array<HTMLElement>): boolean {
    /* istanbul ignore next */
    /* sanity check */
    let eventTarget = event.target || event.srcElement;
    return list.length > 0 && eventTarget === list[list.length - 1];
  }

  public isModalFocused(event: KeyboardEvent, modalEl: ElementRef): boolean {
    /* istanbul ignore next */
    /* sanity check */
    let eventTarget = event.target || event.srcElement;
    return modalEl &&
    eventTarget === modalEl.nativeElement.querySelector('.sky-modal-dialog');
  }

  public focusLastElement(list: Array<HTMLElement>): boolean {
    if (list.length > 0) {
      list[list.length - 1].focus();
      return true;
    }
    return false;
  }

  public focusFirstElement(list: Array<HTMLElement>): boolean {
    if (list.length > 0) {
      list[0].focus();
      return true;
    }
    return false;
  }

  public modalOpened(modalEl: ElementRef): void {
    /* istanbul ignore else */
    /* handle the case where somehow there is a focused element already in the modal */
    if (!(document.activeElement && modalEl.nativeElement.contains(document.activeElement))) {
      let currentScrollX = window.pageXOffset;
      let currentScrollY = window.pageYOffset;

      let inputWithAutofocus = modalEl.nativeElement.querySelector('[autofocus]');

      if (inputWithAutofocus) {
        inputWithAutofocus.focus();
      } else {
        let focusEl: HTMLElement = modalEl.nativeElement.querySelector('.sky-modal-content');
        let focusableChildren = this.loadFocusableChildren(focusEl);

        // Focus first focusable child if available. Otherwise focus content pane.
        if (!this.focusFirstElement(focusableChildren)) {
          focusEl.focus();
        }
      }
      window.scrollTo(currentScrollX, currentScrollY);
    }
  }

  private loadFocusableChildren(elem: HTMLElement) {
    let elements: Array<HTMLElement>
      = Array.prototype.slice.call(elem.querySelectorAll(tabbableSelector));

    return elements.filter((element) => {
      return this.isVisible(element);
    });
  }

  private isVisible(element: HTMLElement) {
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
}
