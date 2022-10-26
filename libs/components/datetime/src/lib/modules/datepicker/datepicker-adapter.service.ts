import { ElementRef, Injectable, Renderer2 } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyDatepickerAdapterService {
  #el: HTMLElement;

  #renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.#renderer = renderer;
  }

  public init(elRef: ElementRef) {
    this.#el = elRef.nativeElement;
  }

  public elementIsFocused(): boolean {
    const focusedEl = document.activeElement;

    return this.#el.contains(focusedEl);
  }

  public elementIsVisible(): boolean {
    const styles = this.#el && getComputedStyle(this.#el);

    return styles && styles.visibility === 'visible';
  }

  public getPlaceholder(elementRef: ElementRef): string {
    return elementRef.nativeElement.getAttribute('placeholder');
  }

  public setPlaceholder(elementRef: ElementRef, value: string): void {
    this.#renderer.setAttribute(elementRef.nativeElement, 'placeholder', value);
  }
}
