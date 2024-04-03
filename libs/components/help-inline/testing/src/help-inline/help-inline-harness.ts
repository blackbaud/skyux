import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyHelpInlineHarnessFilters } from './help-inline-harness.filters';

export class SkyHelpInlineHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-help-inline';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyHelpInlineHarness` that meets certain criteria
   */
  public static with(
    filters: SkyHelpInlineHarnessFilters,
  ): HarnessPredicate<SkyHelpInlineHarness> {
    return SkyHelpInlineHarness.getDataSkyIdPredicate(filters);
  }
}
