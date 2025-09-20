import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { SkyCoreAdapterService, SkyOverlayInstance } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyAutocompleteAdapterService {
  #coreAdapterService: SkyCoreAdapterService;

  #renderer: Renderer2;

  constructor(
    coreAdapterService: SkyCoreAdapterService,
    rendererFactory: RendererFactory2,
  ) {
    this.#coreAdapterService = coreAdapterService;
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * Adds the className for the provided element.
   */
  public addCSSClass(element: HTMLElement, className: string): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (element) {
      this.#renderer.addClass(element, className);
    }
  }

  public getOverlayFocusableElements(
    overlay: SkyOverlayInstance,
  ): HTMLElement[] {
    return this.#coreAdapterService.getFocusableChildren(
      /* Sanity check - calling function also has null check */
      /* istanbul ignore next */
      overlay?.componentRef.location.nativeElement,
      { ignoreTabIndex: true },
    );
  }

  /**
   * Removes the className for the provided element.
   */
  public removeCSSClass(element: HTMLElement, className: string): void {
    /* Sanity check */
    /* istanbul ignore else */
    if (element) {
      this.#renderer.removeClass(element, className);
    }
  }

  public setDropdownWidth(
    elementRef: ElementRef,
    dropdownRef: ElementRef,
    isInputBox: boolean,
  ): void {
    // `setTimeout` ensures that the input box size is correct when grabbing the width. When the input is initially focused a parent's `overflow-y: auto` value can cause the width to be incorrect during initial rendering.
    setTimeout(() => {
      const parentElement = isInputBox
        ? elementRef.nativeElement.closest('.sky-input-box')
        : elementRef.nativeElement;
      if (parentElement) {
        const width = parentElement.getBoundingClientRect().width;
        this.#renderer.setStyle(
          dropdownRef.nativeElement,
          'width',
          `${width}px`,
        );
      }
    });
  }

  /**
   * Sets the `tabIndex` of the `element` to the provided `tabIndex`.
   */
  public setTabIndex(element: HTMLElement, tabIndex: number): void {
    element.tabIndex = tabIndex;
  }
}
