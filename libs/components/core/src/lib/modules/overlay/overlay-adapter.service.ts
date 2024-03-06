import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyOverlayAdapterService {
  #renderer: Renderer2;

  #styleElement: HTMLStyleElement | undefined;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public restrictBodyScroll(): void {
    // Create a style element to avoid overwriting any existing inline body styles.
    const styleElement = this.#renderer.createElement('style');
    const textNode = this.#renderer.createText('body { overflow: hidden }');

    // Apply a `data-` attribute to make unit testing easier.
    this.#renderer.setAttribute(
      styleElement,
      'data-test-selector',
      'sky-overlay-restrict-scroll-styles',
    );

    this.#renderer.appendChild(styleElement, textNode);
    this.#renderer.appendChild(document.head, styleElement);

    if (this.#styleElement) {
      this.#destroyStyleElement();
    }

    this.#styleElement = styleElement;
  }

  public releaseBodyScroll(): void {
    this.#destroyStyleElement();
  }

  #destroyStyleElement(): void {
    /* istanbul ignore else */
    if (
      this.#styleElement &&
      this.#styleElement.parentElement === document.head
    ) {
      this.#renderer.removeChild(document.head, this.#styleElement);
    }
  }

  public addAriaHiddenToSiblings(
    overlayElementRef: ElementRef,
  ): Map<Element, string | null> {
    const overlayElement = overlayElementRef.nativeElement;
    const hostSiblings = overlayElement.parentElement.children;

    const siblingAriaHiddenCache = new Map<Element, string | null>();

    for (const element of hostSiblings) {
      if (
        element !== overlayElement &&
        !element.hasAttribute('aria-live') &&
        element.nodeName.toLowerCase() !== 'script' &&
        element.nodeName.toLowerCase() !== 'style'
      ) {
        // preserve previous aria-hidden status of elements outside of modal host
        siblingAriaHiddenCache.set(
          element,
          element.getAttribute('aria-hidden'),
        );
        element.setAttribute('aria-hidden', 'true');
      }
    }

    return siblingAriaHiddenCache;
  }

  public restoreAriaHiddenForSiblings(
    siblingAriaHiddenCache: Map<Element, string | null>,
  ): void {
    siblingAriaHiddenCache.forEach((previousValue, element) => {
      // if element had aria-hidden status prior, restore status
      if (element.parentElement) {
        if (previousValue) {
          element.setAttribute('aria-hidden', previousValue);
        } else {
          element.removeAttribute('aria-hidden');
        }
      }
    });

    siblingAriaHiddenCache.clear();
  }
}
