import { DOCUMENT, Injectable, inject } from '@angular/core';

import type { DOMPurify, WindowLike } from 'dompurify';
import createDOMPurify from 'dompurify';

/**
 * The `SkyTextSanitizationService` user the `DOMPurify` library to sanitize strings for use
 * in the DOM. `DOMPurify` allows more customization than Angular's internal `DomSanitizer` so we
 * can preserve `<style>` tags and allow `target` attributes for new tab links.
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyTextSanitizationService {
  readonly #allowedAttributes: string[] = ['target'];
  readonly #domPurify: DOMPurify = createDOMPurify(
    inject(DOCUMENT).defaultView as WindowLike | undefined,
  );

  constructor() {
    this.#domPurify.addHook('afterSanitizeAttributes', (node: Element) => {
      // Set all elements owning target to target=_blank
      // so we only allow the target attribute with that value.
      if (node.getAttribute('target')) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /**
   * Returns a sanitized string, allowing target attribute for new tab links.
   */
  public sanitize(htmlString: string): string {
    return this.#domPurify.sanitize(htmlString, {
      ADD_ATTR: this.#allowedAttributes,
    });
  }
}
