import { ElementRef, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalComponentAdapterService {
  public handleWindowChange(modalEl: ElementRef): void {
    const boundedHeightEl = modalEl.nativeElement.querySelector('.sky-modal');
    const fullPageModalEl = modalEl.nativeElement.querySelector(
      '.sky-modal-full-page',
    );
    /*
      Set modal height equal to max height of window (accounting for padding above and below modal)
    */
    const newHeight = window.innerHeight - 40;

    boundedHeightEl.style.maxHeight = newHeight.toString() + 'px';
    if (fullPageModalEl) {
      this.#setFullPageHeight(fullPageModalEl);
    } else {
      /*
        IE11 doesn't handle flex and max-height correctly so we have to explicitly add
        max-height to the content that accounts for standard header and footer height.
      */
      const modalContentEl =
        modalEl.nativeElement.querySelector('.sky-modal-content');
      const contentHeight = newHeight - 114;
      modalContentEl.style.maxHeight = contentHeight.toString() + 'px';
    }
  }

  public isFocusInFirstItem(
    event: KeyboardEvent,
    list: HTMLElement[],
  ): boolean {
    /* istanbul ignore next */
    /* sanity check */
    const eventTarget = event.target || event.srcElement;
    return list.length > 0 && eventTarget === list[0];
  }

  public isFocusInLastItem(event: KeyboardEvent, list: HTMLElement[]): boolean {
    /* istanbul ignore next */
    /* sanity check */
    const eventTarget = event.target || event.srcElement;
    return list.length > 0 && eventTarget === list[list.length - 1];
  }

  public isModalFocused(event: KeyboardEvent, modalEl: ElementRef): boolean {
    /* istanbul ignore next */
    /* sanity check */
    const eventTarget = event.target || event.srcElement;
    return (
      modalEl &&
      eventTarget === modalEl.nativeElement.querySelector('.sky-modal-dialog')
    );
  }

  public focusLastElement(list: HTMLElement[]): boolean {
    if (list.length > 0) {
      list[list.length - 1].focus();
      return true;
    }
    return false;
  }

  public focusFirstElement(list: HTMLElement[]): boolean {
    if (list.length > 0) {
      list[0].focus();
      return true;
    }
    return false;
  }

  public modalContentHasDirectChildViewkeeper(
    modalContentEl: ElementRef,
  ): boolean {
    return !!modalContentEl.nativeElement.querySelector(
      'sky-modal-content > .sky-viewkeeper-fixed',
    );
  }

  #setFullPageHeight(fullPageModalEl: HTMLElement): void {
    const windowHeight = window.innerHeight;
    const fullPageModalStyle = getComputedStyle(fullPageModalEl);

    const marginTopBottom =
      parseInt(fullPageModalStyle.marginTop, 10) +
      parseInt(fullPageModalStyle.marginBottom, 10);

    const fullPageModalHeight = windowHeight - marginTopBottom + 'px';

    fullPageModalEl.style.height = fullPageModalHeight;
    fullPageModalEl.style.maxHeight = fullPageModalHeight;
  }
}
