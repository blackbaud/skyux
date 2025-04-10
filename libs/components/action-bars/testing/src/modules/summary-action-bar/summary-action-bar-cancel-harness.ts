import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarCancelHarnessFilters } from './summary-action-bar-cancel-harness-filters';

/**
 * Harness for interacting with a summary action bar cancel component in tests.
 */
export class SkySummaryActionBarCancelHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-cancel';

  #button = this.locatorFor('button.sky-summary-action-bar-cancel');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarCancelHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarCancelHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarCancelHarness> {
    return SkySummaryActionBarCancelHarness.getDataSkyIdPredicate(filters);
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
