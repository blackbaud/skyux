import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyDescriptionListAdapterService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public getWidth(elementRef: ElementRef): number {
    return elementRef.nativeElement.clientWidth;
  }

  public setResponsiveClass(element: ElementRef): void {
    const nativeEl: any = element.nativeElement;
    const width = this.getWidth(element);
    const className = this.getResponsiveClassName(width);

    this.renderer.removeClass(nativeEl, 'sky-responsive-container-xs');
    this.renderer.removeClass(nativeEl, 'sky-responsive-container-sm');
    this.renderer.removeClass(nativeEl, 'sky-responsive-container-md');

    this.renderer.addClass(nativeEl, className);
  }

  private getResponsiveClassName(width: number): string {
    const xsBreakpointMaxPixels = 479;
    const smBreakpointMinPixels = 480;
    const smBreakpointMaxPixels = 767;

    if (width <= xsBreakpointMaxPixels) {
      return 'sky-responsive-container-xs';
    } else if (
      width >= smBreakpointMinPixels &&
      width <= smBreakpointMaxPixels
    ) {
      return 'sky-responsive-container-sm';
    } else {
      return 'sky-responsive-container-md';
    }
  }
}
