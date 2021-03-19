import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyCoreAdapterService,
  SkyMediaBreakpoints
} from '@skyux/core';

const RESPONSIVE_CLASS_SM = 'sky-selection-box-container-sm';
const RESPONSIVE_CLASS_MD = 'sky-selection-box-container-md';
const RESPONSIVE_CLASS_LG = 'sky-selection-box-container-lg';

const BREAKPOINT_SM_MAX_PIXELS = 991;
const BREAKPOINT_MD_MIN_PIXELS = 992;
const BREAKPOINT_MD_MAX_PIXELS = 1439;

/**
 * @internal
 */
@Injectable()
export class SkySelectionBoxAdapterService {

  private renderer: Renderer2;

  constructor(
    private coreAdapterService: SkyCoreAdapterService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  /**
   * Sets focus on the specified element.
   */
  public focus(el: ElementRef): void {
    el.nativeElement.focus();
  }

  /**
   * Returns a child element with the `.sky-switch` class.
   * Useful for getting SKY UX-themed radio buttons or checkboxes.
   */
  public getControl(el: ElementRef): HTMLElement {
    return el.nativeElement.querySelector('.sky-switch');
  }

  /**
   * Returns a breakpoint based on the width.
   * @param width Width of the element in pixels.
   */
  public getBreakpointForWidth(width: number): SkyMediaBreakpoints {
    if (width <= BREAKPOINT_SM_MAX_PIXELS) {
      return SkyMediaBreakpoints.sm;
    } else if (width >= BREAKPOINT_MD_MIN_PIXELS && width <= BREAKPOINT_MD_MAX_PIXELS) {
      return SkyMediaBreakpoints.md;
    } else {
      return SkyMediaBreakpoints.lg;
    }
  }

  /**
   * Returns the width of the `parentNode` of the provided `element`.
   */
  public getParentWidth(element: ElementRef): number {
    return element.nativeElement.parentNode.getBoundingClientRect().width;
  }

  /**
   * Returns `true` if the `childEl` is a descendant of the `parentEl`.
   */
  public isDescendant(parentEl: ElementRef, childEl: HTMLElement): boolean {
    return parentEl.nativeElement.contains(childEl);
  }

  /**
   * Sets the `tabIndex` of all focusable children of the `element` to the provided `tabIndex`.
   */
  public setChildrenTabIndex(element: ElementRef, tabIndex: number): void {
    const el = element.nativeElement;
    const focusableElems = this.coreAdapterService.getFocusableChildren(el, {
      ignoreVisibility: true
    });
    let index = focusableElems.length;
    while (index--) {
      focusableElems[index].tabIndex = tabIndex;
    }
  }

  /**
   * Adds a responsive CSS class on the provided element based on its current width.
   */
  public setResponsiveClass(element: ElementRef, breakpoint: SkyMediaBreakpoints): void {
    const nativeEl: HTMLElement = element.nativeElement;

    this.renderer.removeClass(nativeEl, RESPONSIVE_CLASS_SM);
    this.renderer.removeClass(nativeEl, RESPONSIVE_CLASS_MD);
    this.renderer.removeClass(nativeEl, RESPONSIVE_CLASS_LG);

    let newClass: string;

    // tslint:disable-next-line: switch-default
    switch (breakpoint) {
      case SkyMediaBreakpoints.sm: {
        newClass = RESPONSIVE_CLASS_SM;
        break;
      }
      case SkyMediaBreakpoints.md: {
        newClass = RESPONSIVE_CLASS_MD;
        break;
      }
      case SkyMediaBreakpoints.lg: {
        newClass = RESPONSIVE_CLASS_LG;
        break;
      }
    }

    this.renderer.addClass(nativeEl, newClass);
  }

  /**
   * Sets the `tabIndex` of the `element` to the provided `tabIndex`.
   */
  public setTabIndex(element: ElementRef, tabIndex: number): void {
    const el = element.nativeElement;
    el.tabIndex = tabIndex;
  }

}
