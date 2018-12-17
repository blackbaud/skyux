import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer
} from '@angular/core';

@Injectable()
export class SkyWaitAdapterService implements OnDestroy {
  private static isPageWaitActive = false;
  private static busyElements: {[key: string]: {busyEl: HTMLElement, listener: any}} = {};

  private focussableElements: HTMLElement[];

  constructor(
    private renderer: Renderer
  ) { }

  public ngOnDestroy(): void {
    this.clearListeners();
  }

  public setWaitBounds(waitEl: ElementRef): void {
    this.renderer.setElementStyle(waitEl.nativeElement.parentElement, 'position', 'relative');
  }

  public removeWaitBounds(waitEl: ElementRef): void {
    this.renderer.setElementStyle(waitEl.nativeElement.parentElement, 'position', undefined);
  }

  public setBusyState(
    waitEl: ElementRef,
    isFullPage: boolean,
    isWaiting: boolean,
    isNonBlocking = false,
    waitComponentId?: string
  ): void {
    const busyEl = isFullPage ? document.body : waitEl.nativeElement.parentElement;
    const state = isWaiting ? 'true' : undefined;

    if (!isNonBlocking) {
      this.renderer.setElementAttribute(busyEl, 'aria-busy', state);

      if (isWaiting) {
        // Remove focus from page when full page blocking wait
        if (isFullPage || busyEl.contains(document.activeElement)) {
          this.clearDocumentFocus();
        }

        if (isFullPage) {
          SkyWaitAdapterService.isPageWaitActive = true;
          const endListenerFunc = this.renderer.listen(
            document.body,
            'keydown',
            (event: KeyboardEvent) => {
              if (event.key.toLowerCase() === 'tab') {
                (event.target as any).blur();
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                this.clearDocumentFocus();
              }
          });
          SkyWaitAdapterService.busyElements[waitComponentId] = {
            listener: endListenerFunc,
            busyEl: undefined
          };
        } else {
          const endListenerFunc = this.renderer.listen(
            busyEl,
            'focusin',
            (event: KeyboardEvent) => {
              if (!isNonBlocking) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();

                if (SkyWaitAdapterService.isPageWaitActive) {
                  this.clearDocumentFocus();
                } else {
                  // Propagate tab navigation if attempted into waited element
                  const target: any = event.target;
                  target.blur();
                  this.focusNextElement(target, this.isShift(event), busyEl);
                }
              }
          });
          SkyWaitAdapterService.busyElements[waitComponentId] = {
            listener: endListenerFunc,
            busyEl: busyEl
          };
        }
      } else {
        if (isFullPage) {
          SkyWaitAdapterService.isPageWaitActive = false;
        }
        if (waitComponentId in SkyWaitAdapterService.busyElements) {
          SkyWaitAdapterService.busyElements[waitComponentId].listener();
          delete SkyWaitAdapterService.busyElements[waitComponentId];
        }
      }
    }
  }

  private focusNextElement(targetElement: HTMLElement, shiftKey: boolean, busyEl: Element): void {
    const focussable = this.getFocussableElements();

    // If shift tab, go in the other direction
    const modifier = shiftKey ? -1 : 1;

    // Find the next navigable element that isn't waiting
    const startingIndex = focussable.indexOf(targetElement);
    let curIndex = startingIndex + modifier;
    while (focussable[curIndex] && this.isElementBusyOrHidden(focussable[curIndex])) {
      curIndex += modifier;
    }

    if (focussable[curIndex] && !this.isElementBusyOrHidden(focussable[curIndex])) {
      focussable[curIndex].focus();
    } else {
      // Try wrapping the navigation
      curIndex = modifier > 0 ? 0 : focussable.length - 1;
      while (
        curIndex !== startingIndex &&
        focussable[curIndex] &&
        this.isElementBusyOrHidden(focussable[curIndex])
      ) {
        /* istanbul ignore next */
        /* sanity check */
        curIndex += modifier;
      }

      /* istanbul ignore else */
      /* sanity check */
      if (focussable[curIndex] && !this.isElementBusyOrHidden(focussable[curIndex])) {
        focussable[curIndex].focus();
      } else {
        // No valid target, wipe focus
        this.clearDocumentFocus();
      }
    }

    // clear focussableElements list
    this.focussableElements = undefined;
  }

  private isShift(event: Event): boolean {
    // Determine if shift+tab was used based on element order
    const elements = this.getFocussableElements().filter(elem => !this.isElementHidden(elem));

    const previousInd = elements.indexOf((event as any).relatedTarget);
    const currentInd = elements.indexOf(event.target as HTMLElement);

    return previousInd === currentInd + 1
      || (previousInd === 0 && currentInd === elements.length - 1)
      || (previousInd > currentInd)
      || !(event as any).relatedTarget;
  }

  private isElementHidden(element: any): boolean {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden';
  }

  private isElementBusyOrHidden(element: any): boolean {
    if (this.isElementHidden(element)) {
      return true;
    }

    for (const key of Object.keys(SkyWaitAdapterService.busyElements)) {
      const parentElement = SkyWaitAdapterService.busyElements[key].busyEl;
      if (parentElement && parentElement.contains(element)) {
        return true;
      }
    }
    return false;
  }

  private clearDocumentFocus(): void {
    if (document.activeElement && (document.activeElement as any).blur) {
      (document.activeElement as any).blur();
    }
    document.body.focus();
  }

  private getFocussableElements(): HTMLElement[] {
    // Keep this cached so we can reduce querys
    if (this.focussableElements) {
      return this.focussableElements;
    }

    // Select all possible focussable elements
    const focussableElements =
      'a[href], ' +
      'area[href], ' +
      'input:not([disabled]):not([tabindex=\'-1\']), ' +
      'button:not([disabled]):not([tabindex=\'-1\']), ' +
      'select:not([disabled]):not([tabindex=\'-1\']), ' +
      'textarea:not([disabled]):not([tabindex=\'-1\']), ' +
      'iframe, object, embed, ' +
      '*[tabindex]:not([tabindex=\'-1\']), ' +
      '*[contenteditable=true]';

    this.focussableElements = Array.prototype.filter.call(
      document.body.querySelectorAll(focussableElements),
        (element: any) => {
          return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement;
    });
    return this.focussableElements;
  }

  private clearListeners(): void {
    SkyWaitAdapterService.isPageWaitActive = false;
    for (const key of Object.keys(SkyWaitAdapterService.busyElements)) {
      SkyWaitAdapterService.busyElements[key].listener();
      delete SkyWaitAdapterService.busyElements[key];
    }
  }
}
