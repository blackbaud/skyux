import { ElementRef, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyLookupAdapterService {
  public focusInput(elRef: ElementRef): void {
    const inputEl: HTMLElement =
      elRef.nativeElement.querySelector('.sky-lookup-input');

    /* Sanity check */
    /* istanbul ignore else */
    if (inputEl) {
      inputEl.focus();
    }
  }

  public scrollToShowMoreModalTop(showMoreModalElement: ElementRef): void {
    const modalContentElement =
      showMoreModalElement.nativeElement.querySelector('.sky-modal-content');

    if (modalContentElement) {
      modalContentElement.scrollTop = 0;
    }
  }
}
