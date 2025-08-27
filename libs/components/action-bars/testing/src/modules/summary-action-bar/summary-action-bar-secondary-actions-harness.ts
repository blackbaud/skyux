import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { SkySummaryActionBarSecondaryActionHarness } from './summary-action-bar-secondary-action-harness';
import { SkySummaryActionBarSecondaryActionHarnessFilters } from './summary-action-bar-secondary-action-harness-filters';
import { SkySummaryActionBarSecondaryActionsHarnessFilters } from './summary-action-bar-secondary-actions-harness-filters';

/**
 * Harness for interacting with a summary action bar secondary actions component in tests.
 * Use this harness to query harnesses for an individual action's SkySummaryActionBarSecondaryActionHarness.
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

  /**
   * Gets a specific action that meets certain criteria.
   */
  public async getAction(
    filters: SkySummaryActionBarSecondaryActionHarnessFilters,
  ): Promise<SkySummaryActionBarSecondaryActionHarness> {
    const dropdown = await this.#dropdown();

    if (dropdown) {
      filters['ancestor'] = 'sky-dropdown-menu';
      await dropdown.clickDropdownButton();
      return await this.#documentRootLocator.locatorFor(
        SkySummaryActionBarSecondaryActionHarness.with(filters),
      )();
    }

    return await this.locatorFor(
      SkySummaryActionBarSecondaryActionHarness.with(filters),
    )();
  }

  /**
   * Gets an array of actions.
   * @params filters optional filters to apply to the query.
   */
  public async getActions(
    filters?: SkySummaryActionBarSecondaryActionHarnessFilters,
  ): Promise<SkySummaryActionBarSecondaryActionHarness[]> {
    const dropdown = await this.#dropdown();
    if (dropdown) {
      await dropdown.clickDropdownButton();
      const filtersWithAncestor = filters
        ? { ...filters, ancestor: 'sky-dropdown-menu' }
        : { ancestor: 'sky-dropdown-menu' };
      return await this.#documentRootLocator.locatorForAll(
        SkySummaryActionBarSecondaryActionHarness.with(filtersWithAncestor),
      )();
    }

    return await this.locatorForAll(
      SkySummaryActionBarSecondaryActionHarness.with(filters || {}),
    )();
  }
}
