import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2
} from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyDockDomAdapterService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public setZIndex(zIndex: number, elementRef: ElementRef): void {
    this.renderer.setStyle(elementRef.nativeElement, 'z-index', zIndex);
  }

  public unbindDock(elementRef: ElementRef): void {
    this.renderer.addClass(elementRef.nativeElement, 'sky-dock-unbound');
  }
}
