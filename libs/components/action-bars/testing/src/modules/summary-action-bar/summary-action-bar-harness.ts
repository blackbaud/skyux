import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyChevronHarness } from '@skyux/indicators/testing';

import { SkySummaryActionBarCancelHarness } from './summary-action-bar-cancel-harness';
import { SkySummaryActionBarCancelHarnessFilters } from './summary-action-bar-cancel-harness-filters';
import { SkySummaryActionBarHarnessFilters } from './summary-action-bar-harness-filters';
import { SkySummaryActionBarPrimaryActionHarness } from './summary-action-bar-primary-action-harness';
import { SkySummaryActionBarPrimaryActionHarnessFilters } from './summary-action-bar-primary-action-harness-filters';
import { SkySummaryActionBarSecondaryActionsHarness } from './summary-action-bar-secondary-actions-harness';
import { SkySummaryActionBarSecondaryActionsHarnessFilters } from './summary-action-bar-secondary-actions-harness-filters';
import { SkySummaryActionBarSummaryHarness } from './summary-action-bar-summary-harness';
import { SkySummaryActionBarSummaryHarnessFilters } from './summary-action-bar-summary-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar';

  #chevron = this.locatorForOptional(SkyChevronHarness);

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarHarness> {
    return SkySummaryActionBarHarness.getDataSkyIdPredicate(filters);
  }

  public async getPrimaryAction(
    filters?: SkySummaryActionBarPrimaryActionHarnessFilters,
  ): Promise<SkySummaryActionBarPrimaryActionHarness> {
    return await this.locatorFor(
      SkySummaryActionBarPrimaryActionHarness.with(filters || {}),
    )();
  }

  public async getSecondaryActions(
    filters?: SkySummaryActionBarSecondaryActionsHarnessFilters,
  ): Promise<SkySummaryActionBarSecondaryActionsHarness> {
    return await this.locatorFor(
      SkySummaryActionBarSecondaryActionsHarness.with(filters || {}),
    )();
  }

  public async getCancel(
    filters?: SkySummaryActionBarCancelHarnessFilters,
  ): Promise<SkySummaryActionBarCancelHarness> {
    return await this.locatorFor(
      SkySummaryActionBarCancelHarness.with(filters || {}),
    )();
  }

  public async getSummary(
    filters?: SkySummaryActionBarSummaryHarnessFilters,
  ): Promise<SkySummaryActionBarSummaryHarness> {
    const chevronHarness = await this.#chevron();

    // if in mobile and closed, open the summary
    if (chevronHarness && (await chevronHarness.getDirection()) === 'up') {
      await chevronHarness.toggle();
    }

    return await this.locatorFor(
      SkySummaryActionBarSummaryHarness.with(filters || {}),
    )();
  }
}
