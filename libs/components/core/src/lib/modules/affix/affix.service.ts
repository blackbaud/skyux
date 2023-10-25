import { ViewportRuler } from '@angular/cdk/overlay';
import {
  ElementRef,
  Injectable,
  NgZone,
  RendererFactory2,
  inject,
} from '@angular/core';

import { SkyAffixer } from './affixer';

@Injectable({
  providedIn: 'root',
})
export class SkyAffixService {
  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  readonly #viewportRuler = inject(ViewportRuler);

  readonly #zone = inject(NgZone);

  /**
   * Creates an instance of [[SkyAffixer]].
   * @param affixed The element to be affixed.
   */
  public createAffixer(affixed: ElementRef): SkyAffixer {
    return new SkyAffixer(
      affixed.nativeElement,
      this.#renderer,
      this.#viewportRuler,
      this.#zone
    );
  }
}
