import { ViewportRuler } from '@angular/cdk/overlay';
import {
  ComponentRef,
  ElementRef,
  Injectable,
  NgZone,
  OnDestroy,
  RendererFactory2,
  inject,
} from '@angular/core';

import { SkyDynamicComponentService } from '../dynamic-component/dynamic-component.service';

import { SkyAffixLayoutViewportComponent } from './affix-layout-viewport.component';
import { SkyAffixer } from './affixer';

@Injectable({
  providedIn: 'root',
})
export class SkyAffixService implements OnDestroy {
  readonly #dynamicComponentService = inject(SkyDynamicComponentService);

  readonly #layoutViewport: ComponentRef<SkyAffixLayoutViewportComponent>;

  readonly #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  readonly #viewportRuler = inject(ViewportRuler);

  readonly #zone = inject(NgZone);

  constructor() {
    this.#layoutViewport = this.#dynamicComponentService.createComponent(
      SkyAffixLayoutViewportComponent
    );
  }

  public ngOnDestroy(): void {
    this.#dynamicComponentService.removeComponent(this.#layoutViewport);
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
      this.#layoutViewport.instance.element
    );
  }
}
