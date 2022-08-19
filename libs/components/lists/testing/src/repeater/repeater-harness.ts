import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyRepeaterHarnessFilters } from './repeater-harness-filters';

export class SkyRepeaterHarness extends SkyComponentHarness {
  public static hostSelector = 'sky-repeater';

  public static with(
    filters: SkyRepeaterHarnessFilters
  ): HarnessPredicate<SkyRepeaterHarness> {
    return SkyRepeaterHarness.getDataSkyIdPredicate(filters);
  }
}
