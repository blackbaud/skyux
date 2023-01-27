import { ElementRef, Injectable } from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalComponentAdapterService {
  #coreAdapter: SkyCoreAdapterService;

  constructor(coreAdapter: SkyCoreAdapterService) {
    this.#coreAdapter = coreAdapter;
  }

  public handleWindowChange(modalEl: ElementRef): void {
    const boundedHeightEl = modalEl.nativeElement.querySelector('.sky-modal');
    const fullPageModalEl = modalEl.nativeElement.querySelector(
      '.sky-modal-full-page'
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

  public modalContentHasDirectChildViewkeeper(
    modalContentEl: ElementRef
  ): boolean {
    return !!modalContentEl.nativeElement.querySelector(
      'sky-modal-content > .sky-viewkeeper-fixed'
    );
  }

  public modalOpened(modalEl: ElementRef): void {
    /* istanbul ignore else */
    /* handle the case where somehow there is a focused element already in the modal */
    if (
      !(
        document.activeElement &&
        modalEl.nativeElement.contains(document.activeElement)
      )
    ) {
      const currentScrollX = window.pageXOffset;
      const currentScrollY = window.pageYOffset;

      const inputWithAutofocus =
        modalEl.nativeElement.querySelector('[autofocus]');

      if (inputWithAutofocus) {
        inputWithAutofocus.focus();
      } else {
        this.#coreAdapter.getFocusableChildrenAndApplyFocus(
          modalEl,
          '.sky-modal-content',
          true
        );
      }
      window.scrollTo(currentScrollX, currentScrollY);
    }
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
