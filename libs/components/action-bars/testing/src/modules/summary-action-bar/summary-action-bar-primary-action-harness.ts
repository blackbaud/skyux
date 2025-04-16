import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkySummaryActionBarPrimaryActionHarnessFilters } from './summary-action-bar-primary-action-harness-filters';

/**
 * Harness for interacting with a summary action bar primary action component in tests.
 */
export class SkySummaryActionBarPrimaryActionHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-primary-action';

  #button = this.locatorFor('button');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarPrimaryActionHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarPrimaryActionHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarPrimaryActionHarness> {
    return SkySummaryActionBarPrimaryActionHarness.getDataSkyIdPredicate(
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
