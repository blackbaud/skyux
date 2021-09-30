import {
  SkyAffixHorizontalAlignment
} from '@skyux/core';

import {
  SkyDropdownHorizontalAlignment
} from './types/dropdown-horizontal-alignment';

export function parseAffixHorizontalAlignment(
  alignment: SkyDropdownHorizontalAlignment
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
