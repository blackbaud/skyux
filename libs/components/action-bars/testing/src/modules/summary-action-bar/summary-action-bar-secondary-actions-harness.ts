import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { SkySummaryActionBarSecondaryActionHarness } from './summary-action-bar-secondary-action-harness';
import { SkySummaryActionBarSecondaryActionsHarnessFilters } from './summary-action-bar-secondary-actions-harness-filters';

/**
 * Harness for interacting with a checkbox group component in tests.
 */
export class SkySummaryActionBarSecondaryActionsHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-summary-action-bar-secondary-actions';

  #dropdown = this.locatorForOptional(SkyDropdownHarness);
  #documentRootLocator = this.documentRootLocatorFactory();

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkySummaryActionBarSecondaryActionsHarness` that meets certain criteria.
   */
  public static with(
    filters: SkySummaryActionBarSecondaryActionsHarnessFilters,
  ): HarnessPredicate<SkySummaryActionBarSecondaryActionsHarness> {
    return SkySummaryActionBarSecondaryActionsHarness.getDataSkyIdPredicate(
      filters,
    );
  }

  public async getActions(): Promise<
    SkySummaryActionBarSecondaryActionHarness[]
  > {
    const dropdown = await this.#dropdown();

    if (dropdown) {
      await dropdown.clickDropdownButton();
      return await this.#documentRootLocator.locatorForAll(
        SkySummaryActionBarSecondaryActionHarness.with({
          ancestor: 'sky-dropdown-menu',
        }),
      )();
    }

    return this.locatorForAll(SkySummaryActionBarSecondaryActionHarness)();
  }

  public async getAction(
    dataSkyId: string,
  ): Promise<SkySummaryActionBarSecondaryActionHarness> {
    const dropdown = await this.#dropdown();

    if (dropdown) {
      await dropdown.clickDropdownButton();
      return await this.#documentRootLocator.locatorFor(
        SkySummaryActionBarSecondaryActionHarness.with({
          dataSkyId: dataSkyId,
          ancestor: 'sky-dropdown-menu',
        }),
      )();
    }

    return this.locatorFor(
      SkySummaryActionBarSecondaryActionHarness.with({ dataSkyId: dataSkyId }),
    )();
  }
}
