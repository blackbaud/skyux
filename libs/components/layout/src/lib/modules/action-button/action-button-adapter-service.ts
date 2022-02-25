import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';

const RESPONSIVE_CLASS_SM = 'sky-action-button-container-sm';
const RESPONSIVE_CLASS_MD = 'sky-action-button-container-md';
const RESPONSIVE_CLASS_LG = 'sky-action-button-container-lg';

const BREAKPOINT_MD = 912;
const BREAKPOINT_LG = 1378;

/**
 * @internal
 */
@Injectable()
export class SkyActionButtonAdapterService {
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(undefined, undefined);
  }

  public getParentWidth(element: ElementRef): number {
    return element.nativeElement.parentNode.getBoundingClientRect().width;
  }

  public setResponsiveClass(element: ElementRef, width: number): void {
    const el: any = element.nativeElement;
    const className = this.getResponsiveClassName(width);

    this.renderer.removeClass(el, RESPONSIVE_CLASS_SM);
    this.renderer.removeClass(el, RESPONSIVE_CLASS_MD);
    this.renderer.removeClass(el, RESPONSIVE_CLASS_LG);

    this.renderer.addClass(el, className);
  }

  private getResponsiveClassName(width: number): string {
    if (width < BREAKPOINT_MD) {
      return RESPONSIVE_CLASS_SM;
    } else if (width > BREAKPOINT_MD && width < BREAKPOINT_LG) {
      return RESPONSIVE_CLASS_MD;
    } else {
      return RESPONSIVE_CLASS_LG;
    }
  }
}
