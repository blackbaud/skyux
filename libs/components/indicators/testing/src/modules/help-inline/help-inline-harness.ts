import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyHelpInlineHarnessFilters } from './help-inline-harness-filters';

/**
 * Harness for interacting with a help inline component in tests.
 * @docsId SkyHelpInlineHarnessLegacy
 * @deprecated Use the `SkyHelpInlineHarness` from `@skyux/help-inline/testing` instead.
 */
export class SkyHelpInlineHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-help-inline';

  #getInlineHelpButton = this.locatorFor('.sky-help-inline');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyInlineHelpHarness` that meets certain criteria
   */
  public static with(
    filters: SkyHelpInlineHarnessFilters,
  ): HarnessPredicate<SkyHelpInlineHarness> {
    return SkyHelpInlineHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the help inline icon button
   */
  public async click(): Promise<void> {
    await (await this.#getInlineHelpButton()).click();
  }
}
