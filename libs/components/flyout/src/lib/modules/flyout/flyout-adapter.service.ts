import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { SkyAppWindowRef, SkyMediaBreakpoints } from '@skyux/core';

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

  public setResponsiveClass(
    element: ElementRef,
    breakpoint?: SkyMediaBreakpoints
  ): void {
    /* istanbul ignore if */
    if (!breakpoint) {
      return;
    }
    const nativeEl: HTMLElement = element.nativeElement;

    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-xs');
    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-sm');
    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-md');
    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-lg');

    let newClass: string;

    switch (breakpoint) {
      case SkyMediaBreakpoints.xs: {
        newClass = 'sky-responsive-container-xs';
        break;
      }
      case SkyMediaBreakpoints.sm: {
        newClass = 'sky-responsive-container-sm';
        break;
      }
      case SkyMediaBreakpoints.md: {
        newClass = 'sky-responsive-container-md';
        break;
      }
      default: {
        newClass = 'sky-responsive-container-lg';
        break;
      }
    }

    this.#renderer.addClass(nativeEl, newClass);
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
