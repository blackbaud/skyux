import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import {
  SKY_BREAKPOINTS,
  SkyBreakpoint,
} from '../breakpoint-observer/breakpoint';
import {
  isSkyBreakpoint,
  toSkyBreakpoint,
} from '../breakpoint-observer/breakpoint-utils';
import { SkyMediaBreakpoints } from '../media-query/media-breakpoints';

import { SkyFocusableChildrenOptions } from './focusable-children-options';

const SKY_TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'button:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  '*[contenteditable=true]:not([disabled])',
  '*[tabindex]:not([disabled])',
].join(', ');

@Injectable({
  providedIn: 'root',
})
export class SkyCoreAdapterService {
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * Set the responsive container CSS class for a given element.
   *
   * @param elementRef - The element that will receive the new CSS class.
   * @param breakpoint - The breakpoint to determine which class gets set.
   * For example a breakpoint of "xs" will set a CSS class of "sky-responsive-container-xs".
   * @deprecated Use the `SkyResponsiveHostDirective` instead.
   */
  public setResponsiveContainerClass(
    elementRef: ElementRef,
    breakpoint: SkyBreakpoint | SkyMediaBreakpoints,
  ): void {
    const nativeEl = elementRef.nativeElement;

    for (const breakpointType of SKY_BREAKPOINTS) {
      this.#renderer.removeClass(
        nativeEl,
        `sky-responsive-container-${breakpointType}`,
      );
    }

    if (!isSkyBreakpoint(breakpoint)) {
      breakpoint = toSkyBreakpoint(breakpoint);
    }

    this.#renderer.addClass(nativeEl, `sky-responsive-container-${breakpoint}`);
  }

  /**
   * This method temporarily enables/disables pointer events.
   * This is helpful to prevent iFrames from interfering with drag events.
   *
   * @param enable - Set to `true` to enable pointer events. Set to `false` to disable.
   */
  public toggleIframePointerEvents(enable: boolean): void {
    const iframes = Array.from<HTMLElement>(
      document.querySelectorAll('iframe'),
    );
    for (const iframe of iframes) {
      this.#renderer.setStyle(iframe, 'pointer-events', enable ? '' : 'none');
    }
  }

  /**
   * Focuses on the first element found with an `autofocus` attribute inside the supplied `elementRef`.
   *
   * @param elementRef - The element to search within.
   * @return Returns `true` if a child element with autofocus is found.
   */
  public applyAutoFocus(elementRef?: ElementRef): boolean {
    if (!elementRef) {
      return false;
    }

    const elementWithAutoFocus =
      elementRef.nativeElement.querySelector('[autofocus]');

    // Child was found with the autofocus property. Set focus and return true.
    if (elementWithAutoFocus) {
      elementWithAutoFocus.focus();
      return true;
    }

    // No children were found with autofocus property. Return false.
    return false;
  }

  /**
   * Sets focus on the first focusable child of the `elementRef` parameter.
   * If no focusable children are found, and `focusOnContainerIfNoChildrenFound` is `true`,
   * focus will be set on the container element.
   *
   * @param elementRef - The element to search within.
   * @param containerSelector - A CSS selector indicating the container that should
   * receive focus if no focusable children are found.
   * @param focusOnContainerIfNoChildrenFound - It set to `true`, the container will
   * receive focus if no focusable children are found.
   */
  public getFocusableChildrenAndApplyFocus(
    elementRef: ElementRef,
    containerSelector?: string,
    focusOnContainerIfNoChildrenFound = false,
  ): void {
    const containerElement =
      elementRef.nativeElement.querySelector(containerSelector);

    if (containerElement) {
      const focusableChildren = this.getFocusableChildren(containerElement);

      // Focus first focusable child if available. Otherwise, set focus on container.
      if (
        !this.#focusFirstElement(focusableChildren) &&
        focusOnContainerIfNoChildrenFound
      ) {
        containerElement.focus();
      }
    }
  }

  /**
   * Returns an array of all focusable children of provided `element`.
   *
   * @param element - The HTMLElement to search within.
   * @param options - Options for getting focusable children.
   */
  public getFocusableChildren(
    element?: HTMLElement,
    options?: SkyFocusableChildrenOptions,
  ): HTMLElement[] {
    if (!element) {
      return [];
    }

    let elements = Array.prototype.slice.call(
      element.querySelectorAll(SKY_TABBABLE_SELECTOR),
    );

    // Unless ignoreTabIndex = true, filter out elements with tabindex = -1.
    if (!options || !options.ignoreTabIndex) {
      elements = elements.filter((el: HTMLElement) => {
        return el.tabIndex !== -1;
      });
    }

    // Unless ignoreVisibility = true, filter out elements that are not visible.
    if (!options || !options.ignoreVisibility) {
      elements = elements.filter((el: HTMLElement) => {
        return this.#isVisible(el);
      });
    }

    return elements;
  }

  /**
   * Returns the clientWidth of the provided elementRef.
   * @param elementRef - The element to calculate width from.
   */
  public getWidth(elementRef: ElementRef): number {
    return elementRef.nativeElement.clientWidth;
  }

  /**
   * Checks if an event target has a higher z-index than a given element.
   * @param target The event target element.
   * @param element The element to test against. A z-index must be explicitly set for this element.
   */
  public isTargetAboveElement(
    target: EventTarget,
    element: HTMLElement,
  ): boolean {
    const zIndex = getComputedStyle(element).zIndex;

    let el = target as HTMLElement;

    while (el) {
      // Getting the computed style only works for elements that exist in the DOM.
      // In certain scenarios, an element is removed after a click event; by the time the event
      // bubbles up to other elements, however, the element has been removed and the computed style returns empty.
      // In this case, we'll need to check the z-index directly, via the style property.
      const targetZIndex = getComputedStyle(el).zIndex || el.style.zIndex;
      if (
        targetZIndex !== '' &&
        targetZIndex !== 'auto' &&
        +targetZIndex > +zIndex
      ) {
        return true;
      }

      el = el.parentElement as HTMLElement;
    }

    return false;
  }

  /**
   * Remove inline height styles from the provided elements.
   * @param elementRef - The element to search within.
   * @param selector - The CSS selector to use when finding elements for removing height.
   */
  public resetHeight(elementRef: ElementRef, selector: string): void {
    const children = Array.from<HTMLElement>(
      elementRef.nativeElement.querySelectorAll(selector),
    );
    for (const child of children) {
      this.#renderer.removeStyle(child, 'height');
    }
  }

  /**
   * Sets all element heights to match the height of the tallest element.
   * @param elementRef - The element to search within.
   * @param selector - The CSS selector to use when finding elements for syncing height.
   */
  public syncMaxHeight(elementRef: ElementRef, selector: string): void {
    const children = Array.from<HTMLElement>(
      elementRef.nativeElement.querySelectorAll(selector),
    );
    /* istanbul ignore else */
    if (children.length > 0) {
      let maxHeight = 0;
      for (const child of children) {
        maxHeight = Math.max(maxHeight, child.offsetHeight);
      }
      for (const child of children) {
        this.#renderer.setStyle(child, 'height', `${maxHeight}px`);
      }
    }
  }

  #focusFirstElement(list: HTMLElement[]): boolean {
    if (list.length > 0) {
      list[0].focus();
      return true;
    }
    return false;
  }

  #isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const isHidden = style.display === 'none' || style.visibility === 'hidden';
    if (isHidden) {
      return false;
    }

    const hasBounds = !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
    return hasBounds;
  }
}
