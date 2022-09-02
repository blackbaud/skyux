import { ElementRef, Injectable } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalAdapterService {
  private static readonly MODAL_BODY_FULL_CLASS = 'sky-modal-body-full-page';
  private static readonly MODAL_BODY_CLASS = 'sky-modal-body-open';

  #docRef: any;
  #bodyEl: HTMLElement;

  #windowRef: SkyAppWindowRef;
  #hostSiblingAriaHiddenCache = new Map<Element, string | null>();

  constructor(windowRef: SkyAppWindowRef) {
    this.#windowRef = windowRef;
    this.#docRef = this.#windowRef.nativeWindow.document;
    this.#bodyEl = this.#windowRef.nativeWindow.document.body;
  }

  public toggleFullPageModalClass(isAddFull: boolean): void {
    if (isAddFull) {
      this.#addClassToBody(SkyModalAdapterService.MODAL_BODY_FULL_CLASS);
    } else {
      this.#removeClassFromBody(SkyModalAdapterService.MODAL_BODY_FULL_CLASS);
    }
  }

  public setPageScroll(isAdd: boolean): void {
    if (isAdd) {
      this.#addClassToBody(SkyModalAdapterService.MODAL_BODY_CLASS);
    } else {
      this.#removeClassFromBody(SkyModalAdapterService.MODAL_BODY_CLASS);
    }
  }

  public getModalOpener(): HTMLElement {
    return this.#docRef.activeElement;
  }

  #addClassToBody(className: string): void {
    this.#bodyEl.classList.add(className);
  }

  #removeClassFromBody(className: string): void {
    this.#bodyEl.classList.remove(className);
  }

  /**
   * Hides siblings of modal-host from screen readers
   * @param hostElRef reference to modal-host element
   */
  public hideHostSiblingsFromScreenReaders(hostElRef: ElementRef): void {
    const hostElement = hostElRef.nativeElement;
    const hostSiblings = hostElement.parentElement.children;

    for (let i = 0; i < hostSiblings.length; i++) {
      const element = hostSiblings[i];
      if (
        element !== hostElement &&
        !element.hasAttribute('aria-live') &&
        element.nodeName.toLowerCase() !== 'script' &&
        element.nodeName.toLowerCase() !== 'style'
      ) {
        // preserve previous aria-hidden status of elements outside of modal host
        this.#hostSiblingAriaHiddenCache.set(
          element,
          element.getAttribute('aria-hidden')
        );
        element.setAttribute('aria-hidden', 'true');
      }
    }
  }

  /**
   * Restores modal-host siblings to screenreader status prior to modals being opened
   */
  public unhideOrRestoreHostSiblingsFromScreenReaders(): void {
    this.#hostSiblingAriaHiddenCache.forEach((previousValue, element) => {
      // if element had aria-hidden status prior, restore status
      if (element.parentElement) {
        if (previousValue) {
          element.setAttribute('aria-hidden', previousValue);
        } else {
          element.removeAttribute('aria-hidden');
        }
      }
    });
    this.#hostSiblingAriaHiddenCache.clear();
  }

  public hidePreviousModalFromScreenReaders(topModal: Element): void {
    if (topModal && topModal.previousElementSibling) {
      topModal.previousElementSibling.setAttribute('aria-hidden', 'true');
    }
  }

  public unhidePreviousModalFromScreenReaders(topModal: Element): void {
    if (topModal && topModal.previousElementSibling) {
      topModal.previousElementSibling.removeAttribute('aria-hidden');
    }
  }
}
