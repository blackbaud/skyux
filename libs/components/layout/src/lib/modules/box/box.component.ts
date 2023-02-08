import { Component, Input, ViewEncapsulation } from '@angular/core';

/**
 * Provides a common look-and-feel for box content with options to display a common box header, specify body content, and display common box controls.
 */
@Component({
  selector: 'sky-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyBoxComponent {
  /**
   * The ARIA label for the box. This sets the box's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * The HTML element ID of the element that labels
   * the box. This sets the box's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  @Input()
  public ariaLabelledBy: string | undefined;

  /**
   * The ARIA role for the box
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating what the box contains. For information about
   * how an ARIA role indicates what an item represents on a web page,
   * see the [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   */
  @Input()
  public ariaRole: string | undefined;
}
