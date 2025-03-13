import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyTokenHarness } from '@skyux/indicators/testing';

import { SkyFilterSummaryItemHarnessFilters } from './filter-summary-item-harness-filters';

/**
 * Harness to interact with a filter summary item component in tests.
 */
export class SkyFilterSummaryItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-summary-item';

  #getSummaryItem = this.locatorFor('.sky-filter-summary-item');
  #getToken = this.locatorFor(SkyTokenHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterSummaryItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterSummaryItemHarnessFilters,
  ): HarnessPredicate<SkyFilterSummaryItemHarness> {
    return SkyFilterSummaryItemHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the filter summary item.
   */
  public async clickItem(): Promise<void> {
    await (await this.#getSummaryItem()).click();
  }

  /**
   * Dismisses the filter summary item.
   */
  public async dismiss(): Promise<void> {
    await (await this.#getToken()).dismiss();
  }

  /**
   * Whether the filter summary item is dismissible.
   */
  public async isDismissible(): Promise<boolean> {
    return await (await this.#getToken()).isDismissible();
  }
}
