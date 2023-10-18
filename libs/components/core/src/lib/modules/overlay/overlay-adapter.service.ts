import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  OnDestroy,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';

import { Subscription, fromEvent } from 'rxjs';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyOverlayAdapterService implements OnDestroy {
  readonly #doc = inject(DOCUMENT);

  readonly #renderer: Renderer2;

  readonly #subscription = new Subscription();

  #styleElement: HTMLStyleElement | undefined;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
    this.#maintainVhProperty();
  }

  public ngOnDestroy(): void {
    this.#subscription.unsubscribe();
    this.#doc.documentElement.style.removeProperty('--skyux-vh');
  }

  public restrictBodyScroll(): void {
    // Create a style element to avoid overwriting any existing inline body styles.
    const styleElement = this.#renderer.createElement('style');
    const textNode = this.#renderer.createText('body { overflow: hidden }');

    // Apply a `data-` attribute to make unit testing easier.
    this.#renderer.setAttribute(
      styleElement,
      'data-test-selector',
      'sky-overlay-restrict-scroll-styles'
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

  #maintainVhProperty(): void {
    // Maintain a --skyux-vh CSS property that is equal to 1% of the viewport height.
    // Safari on iOS does not maintain accurate vh units when e.g. the keyboard is shown.
    if (this.#doc.defaultView) {
      const setVhProperty = (): void => {
        this.#doc.documentElement.style.setProperty(
          '--skyux-vh',
          // Fallback value b/c it can technically be undefined.
          /* istanbul ignore next */
          this.#doc.defaultView?.innerHeight
            ? `${this.#doc.defaultView.innerHeight * 0.01}px`
            : '1vh'
        );
      };
      setVhProperty();
      this.#subscription.add(
        fromEvent(this.#doc.defaultView, 'resize').subscribe(setVhProperty)
      );
    }
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
}
