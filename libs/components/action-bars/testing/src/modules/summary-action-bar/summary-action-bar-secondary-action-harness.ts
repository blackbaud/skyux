import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarSecondaryActionHarnessFilters } from './summary-action-bar-secondary-action-harness-filters';

/**
 * Harness for interacting with a summary action bar secondary action component in tests.
 */
export class SkySummaryActionBarSecondaryActionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-secondary-action';

  #button = this.locatorFor('button');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarSecondaryActionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarSecondaryActionHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarSecondaryActionHarness> {
    return SkySummaryActionBarSecondaryActionHarness.getDataSkyIdPredicate(
      filters,
    );
  }

  /**
   * Clicks the button.
   */
  public async click(): Promise<void> {
    return await (await this.#button()).click();
  }

  /**
   * Gets the button text.
   */
  public async getText(): Promise<string> {
    return await (await this.#button()).text();
  }

  /**
   * Whether the button is disabled.
   */
  public async isDisabled(): Promise<boolean> {
    return (await (await this.#button()).getAttribute('disabled')) !== null;
  }
}
