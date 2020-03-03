import {
  SkyAffixHorizontalAlignment
} from './affix-horizontal-alignment';

import {
  SkyAffixPlacement
} from './affix-placement';

import {
  SkyAffixVerticalAlignment
} from './affix-vertical-alignment';

export interface SkyAffixConfig {

  /**
   * Indicates if the affix service should try and find the best placement for the affixed element if the element would be hidden otherwise.
   */
  enableAutoFit?: boolean;

  /**
   * The horizontal alignment of the affixed element to the base element.
   */
  horizontalAlignment?: SkyAffixHorizontalAlignment;

  /**
   * Indicates if the affixed element should remain affixed to the base element when the window is scrolled or resized.
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

}
