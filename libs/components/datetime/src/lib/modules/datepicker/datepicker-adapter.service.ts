import { ElementRef, Injectable, Renderer2 } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyDatepickerAdapterService {
  #renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.#renderer = renderer;
  }

  public getPlaceholder(elementRef: ElementRef): string {
    return elementRef.nativeElement.getAttribute('placeholder');
  }

  public setPlaceholder(elementRef: ElementRef, value: string): void {
    this.#renderer.setAttribute(elementRef.nativeElement, 'placeholder', value);
  }
}
