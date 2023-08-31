import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

import { SkyAffixer } from './affixer';

@Injectable({
  providedIn: 'root',
})
export class SkyAffixService {
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  /**
   * Creates an instance of [[SkyAffixer]].
   * @param affixed The element to be affixed.
   */
  public createAffixer(affixed: ElementRef): SkyAffixer {
    return new SkyAffixer(affixed.nativeElement, this.#renderer);
  }
}
