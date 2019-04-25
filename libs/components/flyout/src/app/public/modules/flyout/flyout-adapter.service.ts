import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

import {
  SkyWindowRefService
} from '@skyux/core';

@Injectable()
export class SkyFlyoutAdapterService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    private windowRef: SkyWindowRefService
  ) {
    this.renderer = this.rendererFactory.createRenderer(undefined, undefined);
  }

  public adjustHeaderForHelp(header: ElementRef): void {
    const windowObj = this.windowRef.getWindow();
    const helpWidget = windowObj.document.getElementById('bb-help-invoker');

    if (helpWidget) {
      this.renderer.addClass(header.nativeElement, 'sky-flyout-help-shim');
    }
  }

  public toggleIframePointerEvents(enable: boolean): void {
    // When iframes are present on the page, they may interfere with dragging
    // temporarily disable pointer events in iframes when dragging starts.
    // When re-enabling we set to the empty string as it will remove the element styling
    // and fall back to any css originally given to iframe
    const iframes = document.querySelectorAll('iframe');
    for (let i = 0; i < iframes.length; i++) {
      iframes[i].style.pointerEvents = enable ? '' : 'none';
    }
  }
}
