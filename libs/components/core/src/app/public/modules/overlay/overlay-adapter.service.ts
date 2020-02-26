
import {
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyAppWindowRef
} from '../window/window-ref';

/**
 * @internal
 */
@Injectable()
export class SkyOverlayAdapterService {

  private renderer: Renderer2;

  constructor(
    private windowRef: SkyAppWindowRef,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public restrictBodyScroll(): void {
    this.renderer.setStyle(
      this.windowRef.nativeWindow.document.body,
      'overflow',
      'hidden'
    );
  }

  public releaseBodyScroll(): void {
    this.renderer.removeStyle(
      this.windowRef.nativeWindow.document.body,
      'overflow'
    );
  }
}
