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
   * Gets the harness for an individual action that matches the given filters.
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
   * Gets the harnesses for all secondary action.
   */
  public async getActions(
    filters?: SkySummaryActionBarSecondaryActionHarnessFilters,
  ): Promise<SkySummaryActionBarSecondaryActionHarness[]> {
    const dropdown = await this.#dropdown();
    if (dropdown) {
      await dropdown.clickDropdownButton();
      if (filters) {
        filters['ancestor'] = 'sky-dropdown-menu';
        const actions = await this.#documentRootLocator.locatorForAll(
          SkySummaryActionBarSecondaryActionHarness.with(filters),
        )();

        if (actions.length === 0 && filters) {
          filters['ancestor'] = undefined;
          throw new Error(
            `Unable to find summary action secondary action(s) with filter(s): ${JSON.stringify(
              filters,
            )}.`,
          );
        }
        return actions;
      } else {
        return await this.#documentRootLocator.locatorForAll(
          SkySummaryActionBarSecondaryActionHarness.with({
            ancestor: 'sky-dropdown-menu',
          }),
        )();
      }
    }

    return await this.locatorForAll(
      SkySummaryActionBarSecondaryActionHarness,
    )();
  }
}
