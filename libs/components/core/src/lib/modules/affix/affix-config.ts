import { SkyAffixAutoFitContext } from './affix-auto-fit-context';
import { SkyAffixHorizontalAlignment } from './affix-horizontal-alignment';
import { SkyAffixOffset } from './affix-offset';
import { SkyAffixPlacement } from './affix-placement';
import { SkyAffixPosition } from './affix-position';
import { SkyAffixVerticalAlignment } from './affix-vertical-alignment';

export interface SkyAffixConfig {
  /**
   * Which parent element is used by the auto-fit functionality.
   */
  autoFitContext?: SkyAffixAutoFitContext;

  /**
   * This optional offset is added to (or subtracted from) the [[SkyAffixAutoFitContext]] element's
   * offset during an auto-fit placement calculation. This value is useful if you need to consider
   * another `position: fixed` element on the page (such as a navbar) when the auto-fit
   * functionality attempts to find the best possible placement.
   * (In the case of a navbar, you would add a `top` value equal to the navbar's height in pixels.)
   */
  autoFitOverflowOffset?: SkyAffixOffset;

  /**
   * Whether the affix service tries to find the best placement for the affixed element
   * if the element would be hidden otherwise. If this setting is disabled, the affix service
   * forces the placement of the affixed element.
   */
  enableAutoFit?: boolean;

  /**
   * The horizontal alignment of the affixed element to the base element.
   */
  horizontalAlignment?: SkyAffixHorizontalAlignment;

  /**
   * Whether the affixed element remains affixed to the base element when the window is scrolled or resized.
   */
  isSticky?: boolean;

  /**
   * The placement of the affixed element around the base element.
   */
  placement?: SkyAffixPlacement;

  /**
   * The vertical alignment of the affixed element to the base element.
   */
  verticalAlignment?: SkyAffixVerticalAlignment;

  /**
   * The position of the element being affixed.
   */
  position?: SkyAffixPosition;
}
