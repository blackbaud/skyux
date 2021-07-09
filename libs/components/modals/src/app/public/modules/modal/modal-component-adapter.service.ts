import {
  Injectable,
  ElementRef
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalComponentAdapterService {
  constructor(
    private coreAdapter: SkyCoreAdapterService
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
      this.setFullPageHeight(fullPageModalEl);
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
        this.coreAdapter.getFocusableChildrenAndApplyFocus(modalEl, '.sky-modal-content', true);
      }
      window.scrollTo(currentScrollX, currentScrollY);
    }
  }

  private setFullPageHeight(fullPageModalEl: HTMLElement): void {
    const windowHeight = window.innerHeight;
    const fullPageModalStyle = getComputedStyle(fullPageModalEl);

    const marginTopBottom =
      parseInt(fullPageModalStyle.marginTop, 10) +
      parseInt(fullPageModalStyle.marginBottom, 10);

    const fullPageModalHeight = (windowHeight - marginTopBottom) + 'px';

    fullPageModalEl.style.height = fullPageModalHeight;
    fullPageModalEl.style.maxHeight = fullPageModalHeight;
  }
}
