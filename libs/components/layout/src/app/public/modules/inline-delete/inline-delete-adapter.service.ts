import {
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyCoreAdapterService
} from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyInlineDeleteAdapterService {

  private element: HTMLElement;
  private focussableElements: HTMLElement[];
  private parentEl: HTMLElement;
  private parentElUnlistenFn: Function;
  private renderer: Renderer2;

  constructor(
    private coreAdapterService: SkyCoreAdapterService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public clearListeners(): void {
    if (this.parentElUnlistenFn) {
      this.parentElUnlistenFn();
    }
  }

  public setEl(element: HTMLElement): void {
    this.element = element;
    this.parentEl = element.parentElement;
    if (this.parentEl) {
      this.parentElUnlistenFn = this.renderer.listen(this.parentEl, 'focusin',
        (event: FocusEvent) => {
          const target: any = event.target;
          if (!this.element.contains(target) && this.parentEl !== target) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            target.blur();
            this.focusNextElement(target, this.isShift(event), this.parentEl);
          }
        });
    }
  }

  private focusNextElement(targetElement: HTMLElement, shiftKey: boolean, busyEl: Element): void {
    const focussable = this.getFocussableElements();

    // If shift tab, go in the other direction
    const modifier = shiftKey ? -1 : 1;

    // Find the next navigable element that isn't waiting
    const startingIndex = focussable.indexOf(targetElement);
    let curIndex = startingIndex + modifier;
    while (focussable[curIndex] && this.isElementHiddenOrCovered(focussable[curIndex])) {
      curIndex += modifier;
    }

    if (focussable[curIndex] && !this.isElementHiddenOrCovered(focussable[curIndex])) {
      focussable[curIndex].focus();
    } else {
      // Try wrapping the navigation
      curIndex = modifier > 0 ? 0 : focussable.length - 1;
      while (
        curIndex !== startingIndex &&
        focussable[curIndex] &&
        this.isElementHiddenOrCovered(focussable[curIndex])
      ) {
        curIndex += modifier;
      }

      /* istanbul ignore else */
      /* sanity check */
      if (focussable[curIndex] && !this.isElementHiddenOrCovered(focussable[curIndex])) {
        focussable[curIndex].focus();
      } else {
        // No valid target, wipe focus
        // This should never happen in practice due to the multiple inline delete buttons
        if (document.activeElement && (document.activeElement as any).blur) {
          (document.activeElement as any).blur();
        }
        document.body.focus();
      }
    }

    // clear focussableElements list so that if things change between tabbing we know about it
    this.focussableElements = undefined;
  }

  private getFocussableElements(): HTMLElement[] {
    // Keep this cached so we can reduce querys
    if (this.focussableElements) {
      return this.focussableElements;
    }

    this.focussableElements = this.coreAdapterService.getFocusableChildren(document.body);

    return this.focussableElements;
  }

  private isElementHiddenOrCovered(element: any): boolean {
    // Check if the element is hidden by css, not within the inline delete, or a wait is covering it
    return this.isElementHidden(element) ||
      (this.parentEl.contains(element) && (!this.element.contains(element) ||
        this.parentEl.querySelector('.sky-wait-mask') !== null));
  }

  private isElementHidden(element: any): boolean {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || style.visibility === 'hidden';
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
}
