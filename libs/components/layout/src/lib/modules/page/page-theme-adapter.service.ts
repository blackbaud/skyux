import { DOCUMENT, Inject, Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyPageThemeAdapterService {
  #styleEl: HTMLStyleElement | undefined;

  #document: Document;

  constructor(@Inject(DOCUMENT) document: Document) {
    this.#document = document;
  }

  /**
   * We can't use ViewEncapsulation.None for this behavior because Angular does
   * not remove `style` tags from the HEAD element after route changes.
   * @see https://github.com/angular/angular/issues/16670
   */
  public addTheme(): void {
    if (!this.#styleEl) {
      this.#styleEl = this.#document.createElement('style');
      this.#styleEl.appendChild(
        this.#document.createTextNode(
          'body:not(.sky-theme-modern) { background-color: #fff; }',
        ),
      );

      this.#document.head.appendChild(this.#styleEl);
    }
  }

  public removeTheme(): void {
    if (this.#styleEl) {
      this.#styleEl.remove();
      this.#styleEl = undefined;
    }
  }
}
