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
   * Specifies an ARIA label for the box. This sets the box's `aria-label` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box includes a visible label, use `ariaLabelledBy` instead.
   */
  @Input()
  public ariaLabel: string;

  /**
   * Specifies the HTML element ID (without the leading `#`) of the element that labels
   * the box. This sets the box's `aria-labelledby` attribute
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the box does not include a visible label, use `ariaLabel` instead.
   */
  @Input()
  public ariaLabelledBy: string;

  /**
   * Specifies an ARIA role for the box
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating what the box contains. For information about
   * how an ARIA role indicates what an item represents on a web page,
   * see the [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/roles).
   */
  @Input()
  public ariaRole: string;
}
