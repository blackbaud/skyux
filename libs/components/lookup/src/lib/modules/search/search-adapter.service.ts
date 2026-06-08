import { ElementRef, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkySearchAdapterService {
  public selectInput(searchEl: ElementRef): void {
    this.#getInputEl(searchEl).select();
  }

  public focusInput(searchEl: ElementRef): void {
    this.#getInputEl(searchEl).focus();
  }

  #getInputEl(searchEl: ElementRef): HTMLInputElement {
    return searchEl.nativeElement.querySelector('input');
  }
}
