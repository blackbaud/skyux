import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyVerticalTabsetGroupHarnessFilters } from './vertical-tabset-group-harness-filters';

/**
 * Harness for interacting with a vertical tabset group in tests.
 */
export class SkyVerticalTabsetGroupHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-vertical-tabset-group';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyVerticalTabsetGroupHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyVerticalTabsetGroupHarnessFilters,
  ): HarnessPredicate<SkyVerticalTabsetGroupHarness> {
    return new HarnessPredicate(
      SkyVerticalTabsetGroupHarness,
      filters,
    ).addOption(
      'groupHeading',
      filters.groupHeading,
      async (harness, heading) => {
        const groupHeading = await harness.locatorFor(
          '.sky-vertical-tabset-group-heading',
        )();
        return (await groupHeading.text()) === heading;
      },
    );
  }
}
