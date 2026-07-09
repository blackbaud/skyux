import { ElementRef, Injectable, inject } from '@angular/core';
import { SkyAppWindowRef, SkyCoreAdapterService } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyModalAdapterService {
  private static readonly MODAL_BODY_FULL_CLASS = 'sky-modal-body-full-page';
  private static readonly MODAL_BODY_CLASS = 'sky-modal-body-open';

  #docRef: any;
  #bodyEl: HTMLElement;

  #coreAdapter = inject(SkyCoreAdapterService);
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

  public scrollContentToTop(element: ElementRef): void {
    element.nativeElement.querySelector('.sky-modal-content').scrollTop = 0;
  }

  /**
   * Hides siblings of modal-host from screen readers
   * @param hostElRef reference to modal-host element
   */
  public hideHostSiblingsFromScreenReaders(hostElRef: ElementRef): void {
    const hostElement = hostElRef.nativeElement;
    const hostSiblings = hostElement.parentElement?.children;

    if (hostSiblings) {
      for (const element of hostSiblings) {
        if (element.contains(document.activeElement)) {
          document.body.focus();
        }
        if (
          element !== hostElement &&
          !element.hasAttribute('aria-live') &&
          element.nodeName.toLowerCase() !== 'script' &&
          element.nodeName.toLowerCase() !== 'style'
        ) {
          // preserve previous aria-hidden status of elements outside of modal host
          this.#hostSiblingAriaHiddenCache.set(
            element,
            element.getAttribute('aria-hidden'),
          );
          element.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  public focusFirstElement(modalEl: ElementRef): void {
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
        const contentEl: HTMLElement | null =
          modalEl.nativeElement.querySelector('.sky-modal-content');

        /* istanbul ignore else */
        /* the modal always renders a content region */
        if (contentEl) {
          const focusableChildren =
            this.#coreAdapter.getFocusableChildren(contentEl);

          if (focusableChildren.length > 0) {
            focusableChildren[0].focus();
          } else {
            // When there is no interactive content to receive focus, place
            // focus on the modal's heading so screen readers announce the
            // dialog. The heading is given a tabindex of -1 so it can receive
            // programmatic focus without being added to the tab order. If no
            // visible heading exists, fall back to focusing the content region.
            const heading: HTMLElement | null =
              modalEl.nativeElement.querySelector('.sky-modal-heading');

            if (heading && heading.offsetParent !== null) {
              heading.setAttribute('tabindex', '-1');
              heading.focus();
            } else {
              contentEl.focus();
            }
          }
        }
      }
      window.scrollTo(currentScrollX, currentScrollY);
    }
  }

  /**
   * Restores modal-host siblings to screen reader status prior to modals being opened
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

  public hidePreviousModalFromScreenReaders(topModal: ElementRef): void {
    if (topModal && topModal.nativeElement.previousElementSibling) {
      topModal.nativeElement.previousElementSibling.setAttribute(
        'aria-hidden',
        'true',
      );
    }
  }

  public unhidePreviousModalFromScreenReaders(topModal: ElementRef): void {
    if (topModal && topModal.nativeElement.previousElementSibling) {
      topModal.nativeElement.previousElementSibling.removeAttribute(
        'aria-hidden',
      );
    }
  }
}
