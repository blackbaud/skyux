import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyFilterBarItemHarnessFilters } from './filter-bar-item-harness-filters';

/**
 * Harness to interact with a filter bar item component in tests.
 */
export class SkyFilterBarItemHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-filter-bar-button';

  #getButton = this.locatorFor('button.sky-filter-bar-btn');
  #getFilterName = this.locatorFor('span.sky-filter-bar-filter-item-name');
  #getFilterValue = this.locatorForOptional(
    'span.sky-filter-bar-filter-item-value',
  );

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyFilterBarItemHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyFilterBarItemHarnessFilters,
  ): HarnessPredicate<SkyFilterBarItemHarness> {
    return SkyFilterBarItemHarness.getDataSkyIdPredicate(filters)
      .addOption('id', filters.id, async (harness, id) => {
        const harnessId = await (
          await harness.#getButton()
        ).getAttribute('data-filter-id');
        return await HarnessPredicate.stringMatches(harnessId, id);
      })
      .addOption('name', filters.name, async (harness, name) => {
        const harnessName = await harness.getName();
        return await HarnessPredicate.stringMatches(harnessName, name);
      });
  }

  /**
   * Clicks the filter item to open its modal.
   */
  public async click(): Promise<void> {
    return await (await this.#getButton()).click();
  }

  /**
   * Gets the filter item name.
   */
  public async getName(): Promise<string> {
    return await (await this.#getFilterName()).text();
  }

  /**
   * Checks if the filter item has an active value.
   */
  public async hasActiveValue(): Promise<boolean> {
    return !!(await this.#getFilterValue());
  }
}
