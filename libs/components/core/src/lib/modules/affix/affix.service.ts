import { ViewportRuler } from '@angular/cdk/overlay';
import {
  ElementRef,
  Injectable,
  NgZone,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';

import { SkyAffixer } from './affixer';

@Injectable({
  providedIn: 'root',
})
export class SkyAffixService {
  readonly #renderer: Renderer2;

  readonly #viewportRuler = inject(ViewportRuler);

  readonly #zone = inject(NgZone);

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * Creates an instance of [[SkyAffixer]].
   * @param affixed The element to be affixed.
   */
  public createAffixer(affixed: ElementRef): SkyAffixer {
    return new SkyAffixer(
      affixed.nativeElement,
      this.#renderer,
      this.#zone,
      this.#viewportRuler
    );
  }
}
