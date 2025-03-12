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

  #button = this.locatorFor('button.sky-vertical-tabset-button');

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
        // test if u need the HarnessPredicate.stringMatches function
        return (await harness.getGroupHeading()) === heading;
      },
    );
  }

  /**
   * Gets the group heading text.
   */
  public async getGroupHeading(): Promise<string> {
    return (await (await this.#button()).text()).trim();
  }
}
