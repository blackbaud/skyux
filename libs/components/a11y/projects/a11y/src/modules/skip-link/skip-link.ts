import {
  ElementRef
} from '@angular/core';

/**
 * A "skip link" that allows a user to skip parts of the page and go directly to the main content.
 */
export interface SkySkipLink {

  /**
   * The title of the skip link.
   */
  title: string;

  /**
   * The element to scroll to and focus when the skip link is clicked.  This element must
   * allow focus, either by spcecifying an HTML element that allows focus by default (such
   * as a `button` or `a` element) or by setting `tabindex="-1" on the specified element.
   */
  elementRef: ElementRef;

}
