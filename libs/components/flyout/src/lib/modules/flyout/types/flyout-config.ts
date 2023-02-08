import { SkyFlyoutAction } from './flyout-action';
import { SkyFlyoutPermalink } from './flyout-permalink';

/**
 * Specifies the configuration options to set up a flyout.
 */
export interface SkyFlyoutConfig {
  /**
   * The HTML element ID of the element that describes
   * the flyout. This sets the flyout's `aria-describedby` attribute
   * to provide a text equivalent for screen readers [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * The description typically includes text on the flyout but not on items that users
   * interact with, such as buttons and forms.
   * For more information about the `aria-describedby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-describedby).
   */
  ariaDescribedBy?: string;

  /**
   * The ARIA label for the flyout. This sets the flyouts's `aria-label` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the flyout includes a visible label, use `ariaLabelledBy` instead.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  ariaLabel?: string;

  /**
   * The HTML element ID of the element that labels
   * the flyout. This sets the flyout's `aria-labelledby` attribute to provide a text equivalent for screen readers
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If the flyout does not include a visible label, use `ariaLabel` instead.
   * For more information about the `aria-labelledby` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-labelledby).
   */
  ariaLabelledBy?: string;

  /**
   * The ARIA role for the flyout
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility)
   * by indicating how the flyout functions and what it controls. For information about how
   * an ARIA role indicates what an item represents on a web page,
   * see the [WAI-ARIA roles model](https://www.w3.org/WAI/PF/aria/#roles).
   * @default dialog
   * @deprecated Since version `5.1.0`. Consumers should use the default `dialog` role to ensure a
   * proper accessibility implementation.
   */
  ariaRole?: string;

  /**
   * The default width of the flyout container. If you do not provide a width,
   * the flyout defaults to half the width of its container.
   */
  defaultWidth?: number;

  /**
   * The minimum resize width of the flyout container.
   * @default 320
   */
  minWidth?: number;

  /**
   * The maximum resize width of the flyout container.
   * @default defaultWidth
   */
  maxWidth?: number;

  /**
   * Displays a permalink button in the flyout header that navigates users to the URL
   * (or application route) representative of the flyout's contents.
   */
  permalink?: SkyFlyoutPermalink;

  /**
   * Displays a configurable button in the flyout header.
   */
  primaryAction?: SkyFlyoutAction;

  /**
   * The array of custom providers to pass to the component's constructor.
   */
  providers?: any[];

  /**
   * Whether to display iterator buttons in the flyout header
   * to access the next and previous records in a record set.
   * @default false
   */
  showIterator?: boolean;

  /**
   * Disables the previous iterator button in the flyout header that accesses
   * the previous record in a record set.
   * @default false
   */
  iteratorPreviousButtonDisabled?: boolean;

  /**
   * Disables the next iterator button in the flyout header that accesses the next record
   * in a record set.
   * @default false
   */
  iteratorNextButtonDisabled?: boolean;

  /**
   * The unique key for the UI Config Service to retrieve stored settings from a database.
   * The UI Config Service saves configuration settings for users to preserve the width of
   * the flyout. For more information about the UI Config Service,
   * see [the sticky settings documentation](https://developer.blackbaud.com/skyux/learn/get-started/sticky-settings).
   */
  settingsKey?: string;
}
