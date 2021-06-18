import {
  Injectable
} from '@angular/core';

// TODO: figure out how to get the following `import` to work with docs-tools library.
// import DOMPurify from 'dompurify';
const createDOMPurify = require('dompurify');
const domPurify = createDOMPurify(window);

domPurify.addHook('afterSanitizeAttributes', (node: Element) => {
  // Set all elements owning target to target=_blank
  // so we only allow the target attribute with that value.
  if (!!node.getAttribute('target')) {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

/**
 * The `SkyTextSanitizationService` user the `DOMPurify` library to sanitize strings for use
 * in the DOM. `DOMPurify` allows more customization than Angular's internal `DomSanitizer` so we
 * can preserve `<style>` tags and allow `target` attributes for new tab links.
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class SkyTextSanitizationService {

  private allowedAttributes: string[] = ['target'];

  /**
   * Returns a sanitized string, allowing target attribute for new tab links.
   */
  public sanitize(htmlString: string): string {
    return domPurify.sanitize(htmlString, { ADD_ATTR: this.allowedAttributes });
  }

}
