import { Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyPageThemeAdapterService {
  #styleEl: HTMLStyleElement | undefined;

  /**
   * We can't use ViewEncapsulation.None for this behavior because Angular does
   * not remove `style` tags from the HEAD element after route changes.
   * @see https://github.com/angular/angular/issues/16670
   */
  public addTheme(): void {
    if (!this.#styleEl) {
      this.#styleEl = document.createElement('style');
      this.#styleEl.appendChild(
        document.createTextNode('body { background-color: #fff; }')
      );

      document.head.appendChild(this.#styleEl);
    }
  }

  public removeTheme(): void {
    if (this.#styleEl) {
      document.head.removeChild(this.#styleEl);
      this.#styleEl = undefined;
    }
  }
}
