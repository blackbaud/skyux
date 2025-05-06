import { ElementRef, Injectable, Renderer2 } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkySearchAdapterService {
  #renderer: Renderer2;

  constructor(renderer: Renderer2) {
    this.#renderer = renderer;
  }

  public selectInput(searchEl: ElementRef): void {
    this.#getInputEl(searchEl).select();
  }

  public focusInput(searchEl: ElementRef): void {
    this.#getInputEl(searchEl).focus();
  }

  public startInputAnimation(searchEl: ElementRef): void {
    const buttonWidth = this.#getSearchOpenButtonEl(searchEl).clientWidth;
    const offsetWidth = this.#getSearchContainerEl(searchEl).offsetLeft;
    const minWidth = buttonWidth + offsetWidth;

    this.#getInputContainerEl(searchEl).style.minWidth =
      minWidth.toString() + 'px';

    this.#renderer.setStyle(
      this.#getInputContainerEl(searchEl),
      'min-width',
      minWidth.toString() + 'px',
    );
  }

  public endInputAnimation(searchEl: ElementRef): void {
    this.#renderer.setStyle(
      this.#getInputContainerEl(searchEl),
      'min-width',
      '',
    );
  }

  #getInputContainerEl(searchEl: ElementRef): HTMLElement {
    return searchEl.nativeElement.querySelector('.sky-search-input-container');
  }

  #getSearchOpenButtonEl(searchEl: ElementRef): HTMLElement {
    return searchEl.nativeElement.querySelector('.sky-search-btn-open');
  }

  #getSearchContainerEl(searchEl: ElementRef): HTMLElement {
    return searchEl.nativeElement.querySelector('.sky-search-container');
  }

  #getInputEl(searchEl: ElementRef): HTMLInputElement {
    return searchEl.nativeElement.querySelector('input');
  }
}
