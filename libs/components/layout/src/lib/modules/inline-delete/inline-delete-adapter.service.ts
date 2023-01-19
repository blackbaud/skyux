import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { SkyCoreAdapterService } from '@skyux/core';

/* spell-checker:ignore unlisten */
/**
 * @internal
 */
@Injectable()
export class SkyInlineDeleteAdapterService {
  #element: HTMLElement | undefined;
  #focusableElements: HTMLElement[] | undefined;
  #parentEl: HTMLElement | null | undefined;
  #parentElUnlistenFn: (() => void) | undefined;
  #renderer: Renderer2;

  #coreAdapterService: SkyCoreAdapterService;

  constructor(
    coreAdapterService: SkyCoreAdapterService,
    rendererFactory: RendererFactory2
  ) {
    this.#coreAdapterService = coreAdapterService;
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public clearListeners(): void {
    /* istanbul ignore else */
    if (this.#parentElUnlistenFn) {
      this.#parentElUnlistenFn();
    }
  }

  public setEl(element: HTMLElement): void {
    this.#element = element;
    this.#parentEl = element.parentElement;

    /* istanbul ignore else */
    if (this.#parentEl) {
      this.#parentElUnlistenFn = this.#renderer.listen(
        this.#parentEl,
        'focusin',
        (event: FocusEvent) => {
          if (this.#element) {
            const target: any = event.target;
            if (!this.#element.contains(target) && this.#parentEl !== target) {
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();

              target.blur();
              this.#focusNextElement(target, this.#isShift(event));
            }
          }
        }
      );
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
      this.#isElementHiddenOrCovered(focusable[curIndex])
    ) {
      curIndex += modifier;
    }

    if (
      focusable[curIndex] &&
      !this.#isElementHiddenOrCovered(focusable[curIndex])
    ) {
      focusable[curIndex].focus();
    } else {
      // Try wrapping the navigation
      /* istanbul ignore next */
      curIndex = modifier > 0 ? 0 : focusable.length - 1;

      /* istanbul ignore next */
      while (
        curIndex !== startingIndex &&
        focusable[curIndex] &&
        this.#isElementHiddenOrCovered(focusable[curIndex])
      ) {
        curIndex += modifier;
      }

      /* istanbul ignore else */
      /* sanity check */
      if (
        focusable[curIndex] &&
        !this.#isElementHiddenOrCovered(focusable[curIndex])
      ) {
        focusable[curIndex].focus();
      } else {
        // No valid target, wipe focus
        // This should never happen in practice due to the multiple inline delete buttons
        if (document.activeElement && (document.activeElement as any).blur) {
          (document.activeElement as any).blur();
        }
        document.body.focus();
      }
    }

    // clear focusableElements list so that if things change between tabbing we know about it
    this.#focusableElements = undefined;
  }

  #getFocusableElements(): HTMLElement[] {
    // Keep this cached so we can reduce queries
    if (this.#focusableElements) {
      return this.#focusableElements;
    }

    this.#focusableElements = this.#coreAdapterService.getFocusableChildren(
      document.body
    );

    return this.#focusableElements;
  }

  #isElementHiddenOrCovered(element: any): boolean {
    // Check if the element is hidden by css, not within the inline delete, or a wait is covering it
    return (
      this.#isElementHidden(element) ||
      (!!this.#parentEl &&
        this.#parentEl.contains(element) &&
        (!this.#element?.contains(element) ||
          this.#parentEl.querySelector('.sky-wait-mask') !== null))
    );
  }

  #isElementHidden(element: any): boolean {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden';
  }

  #isShift(event: Event): boolean {
    // Determine if shift+tab was used based on element order
    const elements = this.#getFocusableElements().filter(
      (elem) => !this.#isElementHidden(elem)
    );

    const previousInd = elements.indexOf((event as any).relatedTarget);
    const currentInd = elements.indexOf(event.target as HTMLElement);

    /* istanbul ignore next */
    return (
      previousInd === currentInd + 1 ||
      (previousInd === 0 && currentInd === elements.length - 1) ||
      previousInd > currentInd ||
      !(event as any).relatedTarget
    );
  }
}
