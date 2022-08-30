import { Injectable } from '@angular/core';
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

  public addAriaHidden(
    elementsToHide: HTMLCollection,
    self: Element | unknown
  ): Map<Element, string | null> {
    const hiddenElements = new Map<Element, string | null>();

    for (let i = 0; i < elementsToHide.length; i++) {
      const element = elementsToHide[i];
      if (
        element !== self &&
        !element.hasAttribute('aria-live') &&
        element.nodeName.toLowerCase() !== 'script' &&
        element.nodeName.toLowerCase() !== 'style'
      ) {
        // preserve previous aria-hidden status of elements outside of modal host
        hiddenElements.set(element, element.getAttribute('aria-hidden'));
        element.setAttribute('aria-hidden', 'true');
      }
    }

    return hiddenElements;
  }

  public removeAriaHidden(hiddenElements: Map<Element, string | null>): void {
    hiddenElements.forEach((previousValue, element) => {
      // if element had aria-hidden status prior, restore status
      if (previousValue) {
        element.setAttribute('aria-hidden', previousValue);
      } else {
        element.removeAttribute('aria-hidden');
      }
    });
  }
}
