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
  #renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public getParentWidth(element: ElementRef): number | undefined {
    return (
      element.nativeElement as HTMLElement
    ).parentElement?.getBoundingClientRect().width;
  }

  public setResponsiveClass(element: ElementRef, width = 0): void {
    const el: any = element.nativeElement;
    const className = this.#getResponsiveClassName(width);

    this.#renderer.removeClass(el, RESPONSIVE_CLASS_SM);
    this.#renderer.removeClass(el, RESPONSIVE_CLASS_MD);
    this.#renderer.removeClass(el, RESPONSIVE_CLASS_LG);

    this.#renderer.addClass(el, className);
  }

  #getResponsiveClassName(width: number): string {
    if (width < BREAKPOINT_MD) {
      return RESPONSIVE_CLASS_SM;
    } else if (width >= BREAKPOINT_MD && width < BREAKPOINT_LG) {
      return RESPONSIVE_CLASS_MD;
    } else {
      return RESPONSIVE_CLASS_LG;
    }
  }
}
