import { ViewportRuler } from '@angular/cdk/overlay';
import {
  DOCUMENT,
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  RendererFactory2,
  inject,
} from '@angular/core';

import { SkyAffixer } from './affixer';

@Injectable({
  providedIn: 'root',
})
export class SkyAffixService implements OnDestroy {
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  readonly #viewportRuler = inject(ViewportRuler);

  readonly #zone = inject(NgZone);

  readonly #layoutViewport = this.#createLayoutViewportShim(inject(DOCUMENT));

  public ngOnDestroy(): void {
    this.#renderer.removeChild(
      this.#layoutViewport.parentNode,
      this.#layoutViewport,
    );
  }

  /**
   * Creates an instance of [[SkyAffixer]].
   * @param affixed The element to be affixed.
   */
  public createAffixer(affixed: ElementRef): SkyAffixer {
    return new SkyAffixer(
      affixed.nativeElement,
      this.#renderer,
      this.#viewportRuler,
      this.#zone,
      this.#layoutViewport,
    );
  }

  /**
   * Create a layout viewport element that can be used to determine the relative position
   * of the visual viewport. Inspired by
   * https://github.com/WICG/visual-viewport/blob/gh-pages/examples/fixed-to-viewport.html
   */
  #createLayoutViewportShim(doc: Document): HTMLElement {
    const layoutViewportElement = this.#renderer.createElement('div');
    this.#renderer.addClass(
      layoutViewportElement,
      'sky-affix-layout-viewport-shim',
    );
    this.#renderer.setStyle(layoutViewportElement, 'width', '100%');
    this.#renderer.setStyle(layoutViewportElement, 'height', '100%');
    this.#renderer.setStyle(layoutViewportElement, 'position', 'fixed');
    this.#renderer.setStyle(layoutViewportElement, 'top', '0');
    this.#renderer.setStyle(layoutViewportElement, 'left', '0');
    this.#renderer.setStyle(layoutViewportElement, 'visibility', 'hidden');
    this.#renderer.setStyle(layoutViewportElement, 'pointerEvents', 'none');
    this.#renderer.appendChild(doc.body, layoutViewportElement);

    return layoutViewportElement;
  }
}
