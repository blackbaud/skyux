import { ElementRef, Injectable, Renderer2 } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyDatepickerAdapterService {
  #el: HTMLElement | undefined;

  #renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.#renderer = renderer;
  }

  public init(elRef: ElementRef) {
    this.#el = elRef.nativeElement;
  }

  public elementIsFocused(): boolean {
    const focusedEl = document.activeElement;

    return !!this.#el && this.#el.contains(focusedEl);
  }

  public elementIsVisible(): boolean {
    /* istanbul ignore else */
    if (this.#el) {
      const styles = getComputedStyle(this.#el);

      return styles.visibility === 'visible';
    } else {
      return false;
    }
  }

  public getPlaceholder(elementRef: ElementRef): string {
    return elementRef.nativeElement.getAttribute('placeholder');
  }

  public setPlaceholder(elementRef: ElementRef, value: string): void {
    this.#renderer.setAttribute(elementRef.nativeElement, 'placeholder', value);
  }
}
