import { SkyAffixHorizontalAlignment, SkyAffixPlacement } from '@skyux/core';

import { SkyPopoverAlignment } from './types/popover-alignment';

import { SkyPopoverPlacement } from './types/popover-placement';

export function parseAffixPlacement(
  placement: SkyPopoverPlacement
): SkyAffixPlacement {
  switch (placement) {
    case 'above':
      return 'above';
    case 'below':
      return 'below';
    case 'right':
      return 'right';
    case 'left':
      return 'left';
    /* istanbul ignore next */
    default:
      throw `SkyAffixPlacement does not have a matching value for '${placement}'!`;
  }
}

export function parseAffixHorizontalAlignment(
  alignment: SkyPopoverAlignment
): SkyAffixHorizontalAlignment {
  switch (alignment) {
    case 'center':
      return 'center';
    case 'left':
      return 'left';
    case 'right':
      return 'right';
    /* istanbul ignore next */
    default:
      throw `SkyAffixHorizontalAlignment does not have a matching value for '${alignment}'!`;
  }
}
