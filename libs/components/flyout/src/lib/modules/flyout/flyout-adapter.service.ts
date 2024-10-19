import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

/**
 * @internal
 */
@Injectable()
export class SkyFlyoutAdapterService {
  #renderer: Renderer2;

  #windowRef: SkyAppWindowRef;

  constructor(rendererFactory: RendererFactory2, windowRef: SkyAppWindowRef) {
    this.#windowRef = windowRef;
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public adjustHeaderForHelp(header: ElementRef): void {
    const windowObj = this.#windowRef.nativeWindow;
    const helpWidget = windowObj.document.getElementById('bb-help-invoker');

    if (helpWidget) {
      this.#renderer.addClass(header.nativeElement, 'sky-flyout-help-shim');
    }
  }

  public toggleIframePointerEvents(enable: boolean): void {
    // When iframes are present on the page, they may interfere with dragging
    // temporarily disable pointer events in iframes when dragging starts.
    // When re-enabling we set to the empty string as it will remove the element styling
    // and fall back to any css originally given to iframe
    const iframes = Array.from(document.querySelectorAll('iframe'));
    for (const iframe of iframes) {
      this.#renderer.setStyle(iframe, 'pointer-events', enable ? '' : 'none');
    }
  }
}
