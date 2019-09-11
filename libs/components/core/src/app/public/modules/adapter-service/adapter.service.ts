import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyMediaBreakpoints
} from '../media-query';

const SKY_TABBABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([tabindex=\'-1\'])',
  'button:not([disabled]):not([tabindex=\'-1\'])',
  'select:not([disabled]):not([tabindex=\'-1\'])',
  'textarea:not([disabled]):not([tabindex=\'-1\'])',
  'iframe',
  'object',
  'embed',
  '*[tabindex]:not([tabindex=\'-1\'])',
  '*[contenteditable=true]'
].join(', ');

@Injectable()
export class SkyCoreAdapterService {

  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * Set the responsive container CSS class for a given element.
   *
   * @param elementRef - The element that will recieve the new CSS class.
   * @param breakpoint - The SkyMediaBreakpoint will determine which class
   * gets set. For example a SkyMediaBreakpoint of `xs` will set a CSS class of `sky-responsive-container-xs`.
   */
  public setResponsiveContainerClass(elementRef: ElementRef, breakpoint: SkyMediaBreakpoints): void {
    const nativeEl: HTMLElement = elementRef.nativeElement;

    this.renderer.removeClass(nativeEl, 'sky-responsive-container-xs');
    this.renderer.removeClass(nativeEl, 'sky-responsive-container-sm');
    this.renderer.removeClass(nativeEl, 'sky-responsive-container-md');
    this.renderer.removeClass(nativeEl, 'sky-responsive-container-lg');

    let newClass: string;

    switch (breakpoint) {
      case SkyMediaBreakpoints.xs: {
        newClass = 'sky-responsive-container-xs';
        break;
      }
      case SkyMediaBreakpoints.sm: {
        newClass = 'sky-responsive-container-sm';
        break;
      }
      case SkyMediaBreakpoints.md: {
        newClass = 'sky-responsive-container-md';
        break;
      }
      default: {
        newClass = 'sky-responsive-container-lg';
        break;
      }
    }

    this.renderer.addClass(nativeEl, newClass);
  }

  /**
   * This method temporarily enables/disables pointer events.
   * This is helpful to prevent iFrames from interfering with drag events.
   *
   * @param enable - Set to `true` to enable pointer events. Set to `false` to disable.
   */
  public toggleIframePointerEvents(enable: boolean): void {
    const iframes = document.querySelectorAll('iframe');
    for (let i = 0; i < iframes.length; i++) {
      // Setting to empty string will allow iframe to fall back to its prior CSS assignment.
      iframes[i].style.pointerEvents = enable ? '' : 'none';
    }
  }

  /**
   * Focuses on the first element found with an `autofocus` attribute inside the supplied `elementRef`.
   *
   * @param elementRef - The element to search within.
   * @return Returns `true` if a child element with autofocus is found.
   */
  public applyAutoFocus(elementRef: ElementRef): boolean {
    const elementWithAutoFocus = elementRef.nativeElement.querySelector('[autofocus]');

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
   * recieve focus if no focusable children are found.
   * @param focusOnContainerIfNoChildrenFound - It set to `true`, the container will
   * recieve focus if no focusable children are found.
   */
  public getFocusableChildrenAndApplyFocus(
    elementRef: ElementRef,
    containerSelector: string,
    focusOnContainerIfNoChildrenFound: boolean = false
  ): void {
    const containerElement = elementRef.nativeElement.querySelector(containerSelector);
    const focusableChildren = this.getFocusableChildren(containerElement);

    // Focus first focusable child if available. Otherwise, set focus on container.
    if (!this.focusFirstElement(focusableChildren) && focusOnContainerIfNoChildrenFound) {
      containerElement.focus();
    }
  }

  /**
   * Returns an array of all focusable children of provided `element`.
   *
   * @param element - The HTMLElement to search within.
   */
  public getFocusableChildren(element: HTMLElement): HTMLElement[] {
    const elements: Array<HTMLElement>
      = Array.prototype.slice.call(element.querySelectorAll(SKY_TABBABLE_SELECTOR));

    return elements.filter((el) => {
      return this.isVisible(el);
    });
  }

  private focusFirstElement(list: Array<HTMLElement>): boolean {
    if (list.length > 0) {
      list[0].focus();
      return true;
    }
    return false;
  }

  private isVisible(element: HTMLElement): boolean {
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
