import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

const busyElements: Record<
  string,
  {
    busyEl: HTMLElement | undefined;
    listener: () => void;
    restoreFocusElement?: HTMLElement | undefined;
    restoreFocusCheckElement?: HTMLElement | undefined;
  }
> = {};

/**
 * @internal
 */
@Injectable()
export class SkyWaitAdapterService implements OnDestroy {
  public static isPageWaitActive = false;

  #focusableElements: HTMLElement[] | undefined;
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public ngOnDestroy(): void {
    this.#clearListeners();
  }

  public setWaitBounds(waitEl: ElementRef): void {
    this.#renderer.addClass(
      waitEl.nativeElement.parentElement,
      'sky-wait-element-active',
    );
  }

  public removeWaitBounds(waitEl: ElementRef): void {
    this.#renderer.removeClass(
      waitEl.nativeElement.parentElement,
      'sky-wait-element-active',
    );
  }

  public setBusyState(
    waitEl: ElementRef,
    isFullPage: boolean,
    isWaiting: boolean,
    isNonBlocking: boolean,
    waitComponentId?: string,
  ): void {
    const busyEl = isFullPage
      ? document.body
      : waitEl.nativeElement.parentElement;

    if (!isNonBlocking) {
      if (isWaiting) {
        let restoreFocusElement: HTMLElement | undefined = undefined;
        let restoreFocusCheckElement: HTMLElement | undefined = undefined;
        this.#renderer.setAttribute(busyEl, 'aria-busy', 'true');

        // Remove focus from page when full page blocking wait
        if (isFullPage || busyEl.contains(document.activeElement)) {
          if (document.activeElement !== document.body) {
            restoreFocusElement = document.activeElement as HTMLElement;
          }
          this.#clearDocumentFocus();
          restoreFocusCheckElement = document.activeElement as HTMLElement;
        }

        if (isFullPage) {
          SkyWaitAdapterService.isPageWaitActive = true;
          const endListenerFunc = this.#renderer.listen(
            document.body,
            'keydown',
            (event: KeyboardEvent) => {
              /*istanbul ignore else */
              if (event.key) {
                /* istanbul ignore else */
                if (event.key.toLowerCase() === 'tab') {
                  (event.target as HTMLElement).blur();
                  event.preventDefault();
                  event.stopPropagation();
                  event.stopImmediatePropagation();
                  this.#clearDocumentFocus();
                }
              }
            },
          );

          if (waitComponentId) {
            busyElements[waitComponentId] = {
              listener: endListenerFunc,
              busyEl: undefined,
              restoreFocusElement,
              restoreFocusCheckElement,
            };
          }
        } else {
          const endListenerFunc = this.#renderer.listen(
            busyEl,
            'focusin',
            (event: KeyboardEvent) => {
              /* istanbul ignore else */
              if (!isNonBlocking) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (SkyWaitAdapterService.isPageWaitActive) {
                  this.#clearDocumentFocus();
                } else {
                  // Propagate tab navigation if attempted into waited element
                  const target = event.target as HTMLElement;

                  if (target) {
                    target.blur();
                    this.#focusNextElement(target, this.#isShift(event));
                  }
                }
              }
            },
          );

          if (waitComponentId) {
            busyElements[waitComponentId] = {
              listener: endListenerFunc,
              busyEl,
              restoreFocusElement,
              restoreFocusCheckElement,
            };
          }
        }
      } else {
        this.#renderer.removeAttribute(busyEl, 'aria-busy');

        if (isFullPage) {
          SkyWaitAdapterService.isPageWaitActive = false;
        }

        if (waitComponentId && waitComponentId in busyElements) {
          const busyElement = busyElements[waitComponentId];

          busyElement.listener();

          // If there is a restore focus element and the focus has not moved, restore focus.
          if (busyElement.restoreFocusCheckElement === document.activeElement) {
            busyElement.restoreFocusElement?.focus();
          }

          delete busyElements[waitComponentId];
        }
      }
    }
  }

  #focusNextElement(targetElement: HTMLElement, shiftKey: boolean): void {
    const focusable = this.#getFocusableElements();

    // If shift tab, go in the other direction
    const modifier = shiftKey ? -1 : 1;

    // Find the next navigable element that isn't waiting
    const startingIndex = focusable.indexOf(targetElement);
    let curIndex = startingIndex + modifier;
    while (
      focusable[curIndex] &&
      this.#isElementBusyOrHidden(focusable[curIndex])
    ) {
      curIndex += modifier;
    }

    if (
      focusable[curIndex] &&
      !this.#isElementBusyOrHidden(focusable[curIndex])
    ) {
      focusable[curIndex].focus();
    } else {
      // Try wrapping the navigation
      /* istanbul ignore next */
      /* sanity check */
      curIndex = modifier > 0 ? 0 : focusable.length - 1;
      while (
        curIndex !== startingIndex &&
        focusable[curIndex] &&
        this.#isElementBusyOrHidden(focusable[curIndex])
      ) {
        /* istanbul ignore next */
        /* sanity check */
        curIndex += modifier;
      }

      /* istanbul ignore else */
      /* sanity check */
      if (
        focusable[curIndex] &&
        !this.#isElementBusyOrHidden(focusable[curIndex])
      ) {
        focusable[curIndex].focus();
      } else {
        // No valid target, wipe focus
        this.#clearDocumentFocus();
      }
    }

    // clear focusableElements list
    this.#focusableElements = undefined;
  }

  #isShift(event: Event): boolean {
    // Determine if shift+tab was used based on element order
    const elements = this.#getFocusableElements().filter(
      (elem) => !this.#isElementHidden(elem),
    );

    const previousInd = elements.indexOf((event as any).relatedTarget);
    const currentInd = elements.indexOf(event.target as HTMLElement);

    return (
      previousInd === currentInd + 1 ||
      (previousInd === 0 && currentInd === elements.length - 1) ||
      previousInd > currentInd ||
      !(event as any).relatedTarget
    );
  }

  #isElementHidden(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden';
  }

  #isElementBusyOrHidden(element: HTMLElement): boolean {
    if (this.#isElementHidden(element)) {
      return true;
    }

    for (const key of Object.keys(busyElements)) {
      const parentElement = busyElements[key].busyEl;
      if (parentElement && parentElement.contains(element)) {
        return true;
      }
    }
    return false;
  }

  #clearDocumentFocus(): void {
    const activeElement = document.activeElement as HTMLElement;

    /* istanbul ignore else */
    if (activeElement) {
      activeElement.blur();
    }

    document.body.focus();
  }

  #getFocusableElements(): HTMLElement[] {
    // Keep this cached so we can reduce queries
    if (this.#focusableElements) {
      return this.#focusableElements;
    }

    // Select all possible focusable elements
    const focusableElements =
      'a[href], ' +
      'area[href], ' +
      "input:not([disabled]):not([tabindex='-1']), " +
      "button:not([disabled]):not([tabindex='-1']), " +
      "select:not([disabled]):not([tabindex='-1']), " +
      "textarea:not([disabled]):not([tabindex='-1']), " +
      'iframe, object, embed, ' +
      "*[tabindex]:not([tabindex='-1']), " +
      '*[contenteditable=true]';

    this.#focusableElements = Array.prototype.filter.call(
      document.body.querySelectorAll(focusableElements),
      (element: HTMLElement) => {
        return (
          element.offsetWidth > 0 ||
          element.offsetHeight > 0 ||
          element === document.activeElement
        );
      },
    );
    return this.#focusableElements;
  }

  #clearListeners(): void {
    SkyWaitAdapterService.isPageWaitActive = false;
    for (const key of Object.keys(busyElements)) {
      busyElements[key].listener();
      delete busyElements[key];
    }
  }
}
