import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';
import { SkySelectionModalHarness } from '@skyux/lookup/testing';

import { SkyFilterBarHarnessFilters } from './filter-bar-harness-filters';
import { SkyFilterBarItemHarness } from './filter-bar-item-harness';
import { SkyFilterBarItemHarnessFilters } from './filter-bar-item-harness-filters';

/**
 * Harness for interacting with a filter bar component in tests.
 */
export class SkyFilterBarHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-bar';

  #documentRootLocator = this.documentRootLocatorFactory();

  #getClearFiltersButton = this.locatorForOptional(
    '.sky-filter-bar-clear-filters',
  );
  #getFilterPickerButton = this.locatorForOptional(
    '.sky-filter-bar-filter-picker',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterBarHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterBarHarnessFilters,
  ): HarnessPredicate<SkyFilterBarHarness> {
    return SkyFilterBarHarness.getDataSkyIdPredicate(filters);
  }

  /**
   * Clicks the clear filters button.
   */
  public async clickClearFilters(): Promise<void> {
    const button = await this.#getClearFiltersButton();
    if (!button) {
      throw new Error(
        'Unable to find clear filters button because no filters are set',
      );
    }
    await button.click();
  }

  /**
   * Gets a harness for a specific filter bar item that meets certain criteria.
   */
  public async getItem(
    filter: SkyFilterBarItemHarnessFilters,
  ): Promise<SkyFilterBarItemHarness> {
    return await this.locatorFor(SkyFilterBarItemHarness.with(filter))();
  }

  /**
   * Gets an array of all filter bar items.
   */
  public async getItems(
    filters?: SkyFilterBarItemHarnessFilters,
  ): Promise<SkyFilterBarItemHarness[]> {
    const items = await this.locatorForAll(
      SkyFilterBarItemHarness.with(filters || {}),
    )();

    if (filters && items.length === 0) {
      throw new Error(
        `Unable to find any filter bar items with filter(s): ${JSON.stringify(filters)}`,
      );
    }

    return items;
  }

  /**
   * Checks if the filter bar has active filters.
   */
  public async hasActiveFilters(): Promise<boolean> {
    const clearButton = await this.#getClearFiltersButton();
    return !!clearButton;
  }

  /**
   * Checks if the filter picker button is visible.
   */
  public async hasFilterPicker(): Promise<boolean> {
    const pickerButton = await this.#getFilterPickerButton();
    return !!pickerButton;
  }

  /**
   * Clicks the filter picker button and returns a harness for the selection modal that it opened.
   */
  public async openFilterPicker(): Promise<SkySelectionModalHarness> {
    const button = await this.#getFilterPickerButton();
    if (!button) {
      throw new Error('Filter picker button not found');
    }
    await button.click();

    return await this.#documentRootLocator.locatorFor(
      SkySelectionModalHarness,
    )();
  }
}
