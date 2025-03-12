import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabButtonHarnessFilters } from './vertical-tab-button-harness-filters';

/**
 * Harness for interacting with a vertical tab in tests.
 */
export class SkyVerticalTabButtonHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tab';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabButtonHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabButtonHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabButtonHarness> {
    return new HarnessPredicate(SkyVerticalTabButtonHarness, filters).addOption(
      'tabHeading',
      filters.tabHeading,
      async (harness, heading) => {
        const tabLabel = await harness.locatorFor('.sky-vertical-tab-label')();
        return (await tabLabel.text()) === heading;
      },
    );
  }
}
